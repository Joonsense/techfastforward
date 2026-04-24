const CATEGORY_VISUAL: Record<string, { accent: string; motif: string }> = {
  funding: {
    accent: "deep emerald green",
    motif: "stack of glowing data blocks ascending in perspective, abstract financial growth topology, dark studio",
  },
  model_release: {
    accent: "electric cobalt blue",
    motif: "fractured light prism splitting into neural pathways, crystalline AI architecture, macro lens depth of field",
  },
  product_launch: {
    accent: "vivid violet",
    motif: "precision-engineered product form emerging from darkness, dramatic product photography lighting, studio black",
  },
  acquisition: {
    accent: "deep crimson",
    motif: "two monolithic structures merging, tectonic collision of abstract corporate forms, dramatic rim lighting",
  },
  partnership: {
    accent: "sharp cyan",
    motif: "two interlocking geometric systems, bridge connecting two structures at night, cinematic wide angle",
  },
  technology: {
    accent: "amber",
    motif: "extreme close-up of semiconductor circuitry, layered silicon topography, macro photography with bokeh",
  },
  regulation: {
    accent: "gold",
    motif: "imposing classical columns in silhouette against dark sky, long exposure architecture photography, dramatic shadows",
  },
  other: {
    accent: "cool slate",
    motif: "minimalist object in vast dark space, fine art editorial photography, single focused light source",
  },
};

export function buildCoverPrompt(args: {
  title: string;
  category: string;
  excerpt?: string | null;
}): string {
  const visual = CATEGORY_VISUAL[args.category] ?? CATEGORY_VISUAL.other;
  const context = args.excerpt
    ? ` The article is about: ${args.excerpt.slice(0, 120)}.`
    : "";

  return [
    `High-end editorial cover photo for a premium B2B technology publication.${context}`,
    `Visual concept: ${visual.motif}.`,
    `Color palette: near-black background, single dominant accent — ${visual.accent} — as the only light source or highlight.`,
    `Style: cinematic commercial photography. Think Bloomberg Businessweek or Wired cover quality.`,
    `Lighting: dramatic single-source, deep shadows, subtle volumetric rays.`,
    `Composition: asymmetric rule-of-thirds, strong foreground-background depth, slight film grain.`,
    `Absolutely no text, letters, numbers, logos, watermarks, or UI elements anywhere.`,
    `No human faces, no people. Abstract or object-only.`,
    `16:9 aspect ratio. Ultra high resolution.`,
  ].join(" ");
}
