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
        // Il Palazzo dei Destini Incrociati
        date: z.string().optional(),
        place: z.string().optional(),
        cards: z.array(z.string()).optional(),
      }),
    }),

    // The wiki of Fulcron: one Markdown file per page, folders = sections
    wiki: defineCollection({
      type: 'page',
      source: 'wiki/**/*.md',
      schema: z.object({
        updated: z.string().optional(),
        // Position in the wiki menu (lower first); the rest is alphabetical
        order: z.number().optional(),
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
        // Where the event took place (optional)
        place: z.string().optional(),
        // Page of the event on this site, e.g. /oneshot/palazzo-destini (optional)
        page: z.string().optional(),
      }),
    }),
  },
})
