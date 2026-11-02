// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://fulcrongrv.it'
const description =
  'FulcronGRV è un’associazione di gioco di ruolo dal vivo (LARP) dell’Appennino Tosco-Emiliano: la campagna fantasy “La Sinfonia dei Sette”, oneshot e molto altro.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/image'],

  css: [
    '@fontsource/marcellus-sc/400.css',
    '@fontsource/marcellus/400.css',
    '@fontsource/montserrat/400.css',
    '@fontsource/montserrat/500.css',
    '@fontsource/montserrat/600.css',
    '@fontsource/montserrat/400-italic.css',
    '~/assets/main.css',
  ],

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
        // Enables the scroll-reveal animations only when JavaScript runs,
        // so content is never hidden without JS or for crawlers.
        { innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' },
      ],
    },
  },

  // Static images are served as WebP in the right size (https://image.nuxt.com).
  // AVIF is smaller but much slower to encode on the fly on a small server.
  image: {
    format: ['webp'],
    quality: 72,
    ipx: { maxAge: 60 * 60 * 24 * 30 },
  },

  runtimeConfig: {
    // NUXT_MONGODB_URI, e.g. mongodb://user:pass@host:27017/fulcron?authSource=admin
    mongodbUri: '',
    // NUXT_GALLERY_DIR: folder that holds one sub-folder of photos per album
    galleryDir: './gallery',
    public: {
      siteUrl,
    },
  },

  routeRules: {
    // Old URLs from the previous version of the site
    '/who': { redirect: { to: '/chi-siamo', statusCode: 301 } },
    '/sinfonia': { redirect: { to: '/sinfonia/ambientazione', statusCode: 302 } },
    '/api/foto/**': { redirect: { to: '/gallery/**', statusCode: 301 } },
    // Cache the static pages; the data-driven ones are refreshed often
    '/api/**': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
  },

  nitro: {
    compressPublicAssets: true,
  },

  devServer: {
    port: 8080,
  },
})
