import type { MaybeRefOrGetter } from 'vue'

type Text = MaybeRefOrGetter<string | null | undefined>

/**
 * Title, description and share preview (Open Graph) of a page, in one place.
 * Missing values fall back to the site's own, so a page never shares an empty preview;
 * images become absolute URLs, as Facebook, WhatsApp and the like require.
 * `modified` (YYYY-MM-DD) also gives the sitemap its <lastmod>.
 */
export function useSocialMeta(meta: { title?: Text; description?: Text; image?: Text; modified?: Text }) {
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const description = () => toValue(meta.description) || SITE_DESCRIPTION

  useSeoMeta({
    title: () => toValue(meta.title) || undefined,
    ogTitle: () => toValue(meta.title) || 'FulcronGRV · Gioco di ruolo dal vivo',
    description,
    ogDescription: description,
    ogImage: () => absoluteUrl(siteUrl, toValue(meta.image) || SITE_IMAGE),
    articleModifiedTime: () => toValue(meta.modified) || undefined,
  })
}

/** "/oneshots/Tear Asunder.jpg" → "https://fulcrongrv.it/oneshots/Tear%20Asunder.jpg"; full URLs stay as they are. */
export function absoluteUrl(siteUrl: string, src: string) {
  if (/^https?:\/\//.test(src)) return src
  let path = src
  try {
    path = decodeURI(src)
  } catch {
    // Not encoded in the first place
  }
  return siteUrl + encodeURI(path.startsWith('/') ? path : `/${path}`)
}
