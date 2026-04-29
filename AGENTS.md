<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# TechFastForward — Editorial Agent Guide

## Site overview
TechFastForward (techfastforward.com) is a premium AI & tech news analysis site. Target audience: Korean-speaking tech professionals, investors, and founders who want deep insight, not just headlines.

## Supabase
- Project ID: `oasnxyeuhrceklgjbndf`
- Table: `articles`
- Key columns: `slug` (unique), `title`, `title_ko`, `subtitle`, `subtitle_ko`, `body_html`, `body_html_ko`, `category`, `tags` (text[]), `key_takeaways` (text[]), `reading_time_min` (int), `author`, `status`, `language`, `has_ko` (bool), `cover_gen_attempts` (int), `published_at`, `created_at`
- Always insert with: `status=published`, `language=en`, `has_ko=true`, `author=TFF Editorial`, `cover_gen_attempts=0`

## Article categories
`funding` | `model_release` | `technology` | `product_launch` | `acquisition` | `partnership` | `regulation` | `other`

## Article quality standard

### Title (Korean)
- Must be punchy and curiosity-inducing
- The reader must feel they will miss something important if they skip it
- Bad: "OpenAI가 새 모델을 출시했다" — just a fact
- Good: "OpenAI 신모델이 던진 불편한 질문: 우리는 무엇을 잃고 있나"

### Body structure (HTML for body_html and body_html_ko — identical)
```
<p>[Opening hook: start with the most surprising or counterintuitive angle. NOT the obvious headline. Make the reader lean forward.]</p>

<h2>[Section: What actually happened — with key numbers in <strong> tags]</h2>
<p>...</p>

<h2>[Section: Why this matters more than people think]</h2>
<p>...</p>

<h2>숨은 인사이트: [The non-obvious angle]</h2>
<p>[Second-order effects. What no one else is saying. Historical parallels. Counterintuitive conclusions.]</p>

<blockquote><p>[Single sharpest sentence that captures the whole insight — the one line readers will screenshot]</p></blockquote>

<hr/>

<div class="summary-box">
<h3>핵심 요약</h3>
<ul>
<li><strong>[key stat or fact]</strong> — one explanatory sentence</li>
<li><strong>[key stat or fact]</strong> — one explanatory sentence</li>
<li><strong>[key stat or fact]</strong> — one explanatory sentence</li>
<li><strong>[key stat or fact]</strong> — one explanatory sentence</li>
<li><strong>[key stat or fact]</strong> — one explanatory sentence</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>[Question that challenges a common assumption about this story]</li>
<li>[Question about second-order effects or future implications]</li>
<li>[Question that makes the reader reflect on their own career, business, or investments]</li>
</ol>
</div>
```

### Metadata
- `subtitle`: English, max 160 chars, factual SEO excerpt (not clickbait)
- `tags`: 3–4 lowercase strings, e.g. `["openai", "funding", "ipo"]`
- `key_takeaways`: 3 concise English bullet points with real data
- `reading_time_min`: 5–8 (based on body length)

### Writing rules
1. Never just summarize the news — find the non-obvious angle
2. Always include specific numbers: dollar amounts, percentages, dates, user counts
3. The "숨은 인사이트" section must offer something readers cannot get from the original source
4. The blockquote must be the single most memorable sentence in the article
5. The think-box questions must make readers feel the article changed how they think
6. Minimum 4 paragraphs before the hr divider
7. Body content is Korean throughout; subtitle is English for SEO

## Slug generation
Lowercase the Korean title, transliterate if possible, remove all non-alphanumeric characters except hyphens, replace spaces with hyphens, truncate to 80 characters.
If the title is all Korean (non-ASCII), derive the slug from the English subtitle instead.

## Deduplication
Always query `SELECT slug FROM articles ORDER BY created_at DESC LIMIT 200` before inserting. Generate slug from each candidate story and skip if already present.

## Publishing checklist
Before each insert verify:
- [ ] slug is unique (not in existing list)
- [ ] body_html has at least 4 p tags, 2 h2 tags, 1 blockquote, 1 hr, summary-box div, think-box div
- [ ] key_takeaways has exactly 3 items
- [ ] tags has 3–4 items
- [ ] published_at and created_at are current UTC ISO timestamps
- [ ] has_ko is true
- [ ] status is published
