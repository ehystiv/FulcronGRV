import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://fulcrongrv.it'
const description =
  'FulcronGRV è un’associazione di gioco di ruolo dal vivo (LARP) dell’Appennino Tosco-Emiliano: la campagna fantasy “La Sinfonia dei Sette”, oneshot e molto altro.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/image'],

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
        { property: 'og:image', content: `${siteUrl}/backgrounds/forest_op_comp.jpg` },
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
      script: [
        // Scroll-reveal animations are enabled only when JavaScript runs,
        // so content is never hidden without JS or for crawlers.
        { innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' },
      ],
    },
  },

  runtimeConfig: {
    public: { siteUrl },
  },

  // Old URLs from the previous versions of the site (static redirect pages)
  routeRules: {
    '/who': { redirect: '/chi-siamo' },
    '/sinfonia': { redirect: '/sinfonia/ambientazione' },
  },

  // Fully static site: `npm run generate` writes everything to .output/public
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
    },
  },

  devServer: {
    port: 8080,
  },
})
