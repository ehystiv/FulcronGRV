import { existsSync, readdirSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import { SITE_DESCRIPTION as description, SITE_IMAGE } from './app/utils/site'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://fulcrongrv.it'

// Gallery photos: public/foto when `npm run gallery` has filled it, otherwise the production bucket on R2.
// A fresh clone (or a Vercel build without NUXT_PUBLIC_GALLERY_URL) still builds and shows the real photos.
const hasLocalPhotos = existsSync('public/foto') && readdirSync('public/foto').length > 0
const galleryUrl = process.env.NUXT_PUBLIC_GALLERY_URL || (hasLocalPhotos ? '/foto' : 'https://foto.fulcrongrv.it')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Markdown content (content/). Node's built-in SQLite, used only at build time.
  content: {
    experimental: { sqliteConnector: 'native' },
  },

  // Images in public/ are converted to WebP and resized when the site is generated.
  // The provider is fixed to ipx: on Vercel @nuxt/image would otherwise switch to
  // /_vercel/image, which does not exist in a static deployment (broken images).
  image: {
    provider: 'ipx',
    format: ['webp'],
    quality: 72,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'it' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'theme-color', content: '#002d40' },
        { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
        { property: 'og:site_name', content: 'FulcronGRV' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'it_IT' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: `${siteUrl}${SITE_IMAGE}` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#002d40' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      galleryUrl,
      // Where the rulebook PDFs are served from: the fulcrongrv-documenti bucket on R2
      documentsUrl: process.env.NUXT_PUBLIC_DOCUMENTS_URL || 'https://documenti.fulcrongrv.it',
    },
  },

  // Old URLs from the previous versions of the site (static redirect pages)
  routeRules: {
    '/who': { redirect: '/chi-siamo' },
    // Wiki pages moved into sections (November 2026)
    '/wiki/calendario': { redirect: '/wiki/storia/calendario' },
    '/wiki/guerra-dell-occhio': { redirect: '/wiki/storia/guerra-dell-occhio' },
    '/wiki/occhio-di-hava': { redirect: '/wiki/storia/occhio-di-hava' },
    '/wiki/razze': { redirect: '/wiki/popoli' },
    '/wiki/geopolitica/est/popolazioni/abenaki': { redirect: '/wiki/popoli/abenaki' },
    '/wiki/geopolitica/sud/popolazioni/abenaki-del-sud': { redirect: '/wiki/popoli/abenaki-del-sud' },
    '/wiki/geopolitica/est/popolazioni': { redirect: '/wiki/popoli' },
    '/wiki/la-setta': { redirect: '/wiki/fazioni/la-setta' },
    '/wiki/religione/armata-santa': { redirect: '/wiki/fazioni/armata-santa' },
    '/wiki/geopolitica/nord/ordine-dei-cronomanti': { redirect: '/wiki/fazioni/ordine-dei-cronomanti' },
    '/wiki/geopolitica/est/partaros/l-ordine-dei-guaritori': { redirect: '/wiki/fazioni/l-ordine-dei-guaritori' },
  },

  // Fully static site: `npm run generate` writes everything to .output/public
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      // Bacheca has no links while it is empty, so the crawler would not find it; the wiki search index is
      // fetched by the browser, never linked
      routes: ['/', '/sinfonia/bacheca', '/wiki-search.json'],
    },
  },

  devServer: {
    port: 8080,
  },
})
