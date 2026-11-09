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
        // Prossimo evento: approximate cost and sign-up link
        cost: z.string().optional(),
        // Prossimo evento: last day (YYYY-MM-DD), after which the box goes back to its generic text
        until: z.string().optional(),
        link: z.string().optional(),
        // Prossimo evento: what the box says while no event is scheduled
        fallback: z.string().optional(),
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
        // Optional: for the oldest events the exact date may not be known
        date: z.date().optional(),
        image: z.string(),
        tags: z.array(z.string()).default([]),
        // Optional link to the photos of the event: an album of the gallery (/gallery/<album>) or an external one
        photos: z.string().optional(),
        // Where the event took place (optional)
        place: z.string().optional(),
        // Page of the event on this site, e.g. /oneshot/palazzo-destini (optional)
        page: z.string().optional(),
      }),
    }),

    // Texts of the home page: one YAML file, content/home.yml
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z.object({
        hero: z.object({ title: z.string(), text: z.string(), image: z.string(), imageAlt: z.string() }),
        intro: z.object({ title: z.string(), text: z.string() }),
        campaign: z.object({ title: z.string(), text: z.string(), note: z.string().optional() }),
        paths: z.array(
          z.object({ title: z.string(), text: z.string(), image: z.string(), cta: z.string(), to: z.string() }),
        ),
        question: z.object({ title: z.string(), text: z.string() }),
      }),
    }),

    // Places on the interactive map of the Ring (/wiki/mappa): one YAML file, content/mappa.yml
    mappa: defineCollection({
      type: 'data',
      source: 'mappa.yml',
      schema: z.object({
        luoghi: z.array(
          z.object({
            id: z.string(),
            nome: z.string(),
            tipo: z.enum([
              'capitale',
              'citta',
              'borgo',
              'fortezza',
              'luogo',
              'evento',
              'macro',
              'regione',
              'regno',
              'mare',
              'isola',
              'foresta',
              'monti',
              'pianura',
              'lago',
              'fiume',
              'deserto',
              'palude',
            ]),
            area: z.enum(['nord', 'est', 'sud', 'ovest', 'mare']),
            x: z.number(),
            y: z.number(),
            livello: z.number().default(2),
            ruota: z.number().optional(),
            etichetta: z.string().optional(),
            lato: z.enum(['destra', 'sinistra']).optional(),
            stimato: z.boolean().default(false),
            dipinto: z.string().optional(),
            testo: z.string().optional(),
            wiki: z.string().optional(),
          }),
        ),
      }),
    }),

    // Photo albums: one JSON per event, written by `npm run gallery`. Title, date, photographer,
    // poster, cover and exclude are edited by hand, the rest is generated.
    gallery: defineCollection({
      type: 'data',
      source: 'gallery/*.json',
      schema: z.object({
        title: z.string(),
        // YYYY-MM-DD
        date: z.string().optional(),
        place: z.string().optional(),
        // Credited on the album page; it applies to the whole album
        photographer: z.string().optional(),
        // Path of the event poster under public/. It replaces the cover photo on the album list
        poster: z.string().optional(),
        // One of the album's photos, as in `photos[].file`. Without it the first photo is used
        cover: z.string().optional(),
        // Original file names to keep off the site
        exclude: z.array(z.string()).default([]),
        count: z.number().default(0),
        first: z.string().optional(),
        photos: z.array(z.object({ file: z.string(), width: z.number(), height: z.number() })).default([]),
      }),
    }),
  },
})
