import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// All the text of the site lives in /content (see content/README.md)
export default defineContentConfig({
  collections: {
    // Pages: one Markdown file per page (chi-siamo, regolamento, privacy…)
    pagine: defineCollection({
      type: 'page',
      source: 'pagine/*.md',
      schema: z.object({
        eyebrow: z.string().optional(),
        lead: z.string().optional(),
        updated: z.string().optional(),
        image: z.string().optional(),
        links: z.array(z.object({ label: z.string(), href: z.string(), primary: z.boolean().optional() })).optional(),
      }),
    }),

    // News board: one file per post, the text is the body of the file
    bacheca: defineCollection({
      type: 'page',
      source: 'bacheca/*.md',
      schema: z.object({
        date: z.date(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),

    // Oneshot archive: the body is the description of the event
    oneshot: defineCollection({
      type: 'page',
      source: 'oneshot/*.md',
      schema: z.object({
        date: z.date(),
        image: z.string(),
        tags: z.array(z.string()).default([]),
        // Optional link to the photos of the event (e.g. an external album)
        photos: z.string().optional(),
      }),
    }),
  },
})
