/**
 * Build an image-gen prompt for an article cover. Consistent editorial
 * aesthetic across all TFF articles — dark obsidian, single warm
 * accent per category, abstract conceptual imagery, no text, no faces.
 */
const CATEGORY_VISUAL: Record<
  string,
  { accent: string; motif: string }
> = {
  funding: {
    accent: "emerald green",
    motif: "abstract rising architectural forms, stacked geometric blocks, subtle upward flow",
  },
  model_release: {
    accent: "electric blue",
    motif: "flowing neural mesh, interconnected geometric nodes, crystalline structure",
  },
  product_launch: {
    accent: "violet",
    motif: "emerging prismatic geometry, unfolding polygonal bloom, radiant structure",
  },
  acquisition: {
    accent: "crimson red",
    motif: "merging monolithic blocks, interlocking architectural forms, fusion geometry",
  },
  partnership: {
    accent: "cyan",
    motif: "two interlocking forms, handshake abstracted to pure geometry, bridge structure",
  },
  technology: {
    accent: "amber orange",
    motif: "circuit-like topography, layered silicon terrain, hardware cross-section",
  },
  regulation: {
    accent: "mustard yellow",
    motif: "towering columns, classical architecture abstracted, authoritative geometry",
  },
  other: {
    accent: "warm gray",
    motif: "minimalist geometric composition, floating shapes, subtle depth",
  },
};

export function buildCoverPrompt(args: {
  title: string;
  category: string;
  excerpt?: string | null;
}): string {
  const visual = CATEGORY_VISUAL[args.category] ?? CATEGORY_VISUAL.other;
  const context = args.excerpt ? ` Subject context: ${args.excerpt}.` : "";
  return [
    `Editorial illustration for a tech news article titled "${args.title}".${context}`,
    `Visual motif: ${visual.motif}.`,
    `Color: dark obsidian background (#07080e), single accent color — ${visual.accent} — used sparingly.`,
    `Style: premium B2B SaaS editorial, minimalist, abstract conceptual.`,
    `Cinematic depth, soft volumetric light, subtle film grain.`,
    `Absolutely no text, no letters, no typography, no logos.`,
    `No people, no faces, no human figures.`,
    `Aspect ratio 16:9, high quality.`,
  ].join(" ");
}
