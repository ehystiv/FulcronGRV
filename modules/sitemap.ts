import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'

// Writes .output/public/sitemap.xml at the end of `nuxt generate`, from the pages that were really
// prerendered: a new page is listed as soon as it is linked from the site, with no list to keep.
// <lastmod> comes from the page's article:modified_time (the `updated` field, see useSocialMeta).
// Left out: error pages, redirects (/who) and pages marked noindex.
export default defineNuxtModule({
  meta: { name: 'sitemap' },
  setup(_, nuxt) {
    if (nuxt.options.dev) return
    const siteUrl = String(nuxt.options.runtimeConfig.public.siteUrl).replace(/\/$/, '')

    nuxt.hook('nitro:init', (nitro) => {
      const pages = new Map<string, string | undefined>()

      nitro.hooks.hook('prerender:route', (route) => {
        if (route.error || route.skip || !route.fileName?.endsWith('.html')) return
        if (['/200.html', '/404.html'].includes(route.fileName)) return
        const html = route.contents ?? ''
        if (/http-equiv="refresh"/i.test(html) || /<meta[^>]+name="robots"[^>]+noindex/i.test(html)) return
        const modified = html.match(/<meta[^>]+property="article:modified_time"[^>]+content="([^"]+)"/)?.[1]
        pages.set(route.route, modified)
      })

      nitro.hooks.hook('prerender:done', async () => {
        const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const urls = [...pages]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([path, modified]) => {
            const lastmod = modified ? `<lastmod>${escape(modified)}</lastmod>` : ''
            return `  <url><loc>${escape(siteUrl + path)}</loc>${lastmod}</url>`
          })
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
        await writeFile(join(nitro.options.output.publicDir, 'sitemap.xml'), xml)
        nitro.logger.info(`Sitemap: ${urls.length} pagine`)
      })
    })
  },
})
