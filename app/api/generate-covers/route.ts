import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildCoverPrompt } from "@/lib/cover-prompt";

/**
 * Queue-based cover image generator. Hit by Vercel Cron every 10 min.
 * Picks up to BATCH articles where cover_image_url IS NULL and
 * cover_gen_attempts < MAX_ATTEMPTS, generates an image via Gemini
 * 2.5 Flash Image, uploads to the article-covers bucket, and writes
 * the public URL back to articles.cover_image_url.
 *
 * Failures bump cover_gen_attempts + write cover_gen_error so one bad
 * row can't starve the queue, and so debugging is trivial in SQL.
 *
 * Manual mode: POST { slug: "..." } to force-generate a single slug.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Hobby cap

const BATCH = 3;
const MAX_ATTEMPTS = 3;
const IMAGEN_MODEL = "imagen-3.0-generate-002";
const BUCKET = "article-covers";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string | null;
  cover_image_url: string | null;
  cover_gen_attempts: number;
}

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getServiceClient() {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}

/**
 * Authorization: either Vercel Cron (User-Agent contains "vercel-cron")
 * or Authorization: Bearer <CRON_SECRET>. The bearer form is used when
 * hitting the endpoint manually.
 */
function authorized(req: NextRequest): boolean {
  const ua = req.headers.get("user-agent") ?? "";
  if (ua.toLowerCase().includes("vercel-cron")) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

async function callImagen(prompt: string): Promise<Buffer> {
  const key = env("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${key}`;
  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "16:9",
      personGeneration: "dont_allow",
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Imagen ${res.status}: ${detail.slice(0, 200)}`);
  }
  type ImagenResponse = {
    predictions?: { bytesBase64Encoded?: string }[];
  };
  const json = (await res.json()) as ImagenResponse;
  const b64 = json.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("Imagen returned no image");
  return Buffer.from(b64, "base64");
}

async function generateAndStore(
  sb: ReturnType<typeof getServiceClient>,
  article: ArticleRow,
): Promise<string> {
  const prompt = buildCoverPrompt({
    title: article.title,
    category: article.category,
    excerpt: article.subtitle,
  });
  const png = await callImagen(prompt);
  const path = `${article.slug}-${Date.now()}.png`;
  const { error: upErr } = await sb.storage
    .from(BUCKET)
    .upload(path, png, { contentType: "image/png", upsert: true });
  if (upErr) throw new Error(`storage upload: ${upErr.message}`);
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function markSuccess(
  sb: ReturnType<typeof getServiceClient>,
  id: string,
  url: string,
) {
  await sb
    .from("articles")
    .update({
      cover_image_url: url,
      cover_gen_last_attempt_at: new Date().toISOString(),
      cover_gen_error: null,
    })
    .eq("id", id);
}

async function markFailure(
  sb: ReturnType<typeof getServiceClient>,
  row: ArticleRow,
  message: string,
) {
  await sb
    .from("articles")
    .update({
      cover_gen_attempts: row.cover_gen_attempts + 1,
      cover_gen_last_attempt_at: new Date().toISOString(),
      cover_gen_error: message.slice(0, 500),
    })
    .eq("id", row.id);
}

async function pickQueue(
  sb: ReturnType<typeof getServiceClient>,
  limit: number,
): Promise<ArticleRow[]> {
  const { data, error } = await sb
    .from("articles")
    .select(
      "id, slug, title, category, subtitle, cover_image_url, cover_gen_attempts",
    )
    .is("cover_image_url", null)
    .lt("cover_gen_attempts", MAX_ATTEMPTS)
    .eq("status", "published")
    .order("cover_gen_last_attempt_at", {
      ascending: true,
      nullsFirst: true,
    })
    .limit(limit);
  if (error) throw new Error(`query: ${error.message}`);
  return (data ?? []) as ArticleRow[];
}

async function pickBySlug(
  sb: ReturnType<typeof getServiceClient>,
  slug: string,
): Promise<ArticleRow | null> {
  const { data, error } = await sb
    .from("articles")
    .select(
      "id, slug, title, category, subtitle, cover_image_url, cover_gen_attempts",
    )
    .eq("slug", slug)
    .single();
  if (error) throw new Error(`query: ${error.message}`);
  return (data as ArticleRow) ?? null;
}

type Outcome =
  | { slug: string; ok: true; url: string }
  | { slug: string; ok: false; error: string };

async function processOne(
  sb: ReturnType<typeof getServiceClient>,
  row: ArticleRow,
): Promise<Outcome> {
  try {
    const url = await generateAndStore(sb, row);
    await markSuccess(sb, row.id, url);
    return { slug: row.slug, ok: true, url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await markFailure(sb, row, msg);
    return { slug: row.slug, ok: false, error: msg };
  }
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const sb = getServiceClient();
    const rows = await pickQueue(sb, BATCH);
    const results: Outcome[] = [];
    for (const row of rows) {
      results.push(await processOne(sb, row));
    }
    return NextResponse.json({
      picked: rows.length,
      processed: results,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { slug?: string };
    const sb = getServiceClient();
    if (!body.slug) {
      return NextResponse.json(
        { error: "slug required in body for manual trigger" },
        { status: 400 },
      );
    }
    const row = await pickBySlug(sb, body.slug);
    if (!row)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    const result = await processOne(sb, row);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
