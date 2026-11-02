import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Site content lives in /content as Markdown files (see content/README.md).
export default defineContentConfig({
  collections: {
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
        // Link to the photos (e.g. /gallery/tear-asunder or an external album)
        photos: z.string().optional(),
      }),
    }),

    // Photo albums: the photos themselves stay in NUXT_GALLERY_DIR/<folder>
    gallery: defineCollection({
      type: 'page',
      source: 'gallery/*.md',
      schema: z.object({
        date: z.date(),
        cover: z.string(),
        // Name of the folder with the photos; defaults to the file name
        folder: z.string().optional(),
        place: z.string().optional(),
        placeIG: z.string().optional(),
        highQuality: z.string().optional(),
      }),
    }),
  },
})
