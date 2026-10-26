import { defineCollection, defineConfig, s } from "velite";

// Keys from docs/CONTENT_MODEL.md §1
const pillar = s.enum(["idees", "produits", "technologie", "impact"]);
const level = s.enum(["decouverte", "intermediaire", "expert"]);
const audience = s.enum(["jeunes", "actifs", "managers", "dirigeants", "seniors", "tech"]);
const format = s.enum(["1h", "2h", "demi-journee", "journee"]);
const kind = s.enum(["hook", "core", "recap", "mirror", "action", "quiz", "feedback", "opening"]);

const formations = defineCollection({
  name: "Formation",
  pattern: "formations/*/index.mdx",
  schema: s.object({
    title: s.string(),
    subtitle: s.string().optional(),
    slug: s.slug("formations"),
    pillar,
    status: s.enum(["pilote", "v1", "bientot"]),
    promise: s.string(),
    keyMessage: s.string().optional(),
    /** Catalogue number (CATALOGUE.md), used for ordering */
    number: s.number(),
    /** Highlight of the course (« moment fort ») */
    highlight: s.string().optional(),
    tags: s.array(s.string()).default([]),
    audiences: s.array(audience),
    levels: s.array(level),
    /** Ordered module ids (file prefix, e.g. "01") per format */
    formats: s.record(format, s.array(s.string())),
    body: s.mdx(),
  }),
});

const modules = defineCollection({
  name: "Module",
  pattern: "formations/*/modules/*.mdx",
  schema: s
    .object({
      title: s.string(),
      kind,
      /** Minutes for the reference format (2h) */
      duration: s.number(),
      /** Per-format overrides of `duration` */
      durations: s.record(format, s.number()).optional(),
      /** Levels where the module is shown; all levels when omitted */
      levels: s.array(level).optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform(({ path, ...data }) => {
      const [, formation = "", , file = ""] = path.split("/");
      return { ...data, formation, id: file.split("-")[0] ?? file };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { formations, modules },
});
