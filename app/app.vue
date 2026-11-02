<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// Canonical URL + og:url for every page
useHead(() => ({
  titleTemplate: (title?: string) =>
    title && title !== 'FulcronGRV' ? `${title} · FulcronGRV` : 'FulcronGRV · Gioco di ruolo dal vivo',
  link: [{ rel: 'canonical', href: config.public.siteUrl.replace(/\/$/, '') + route.path }],
  meta: [{ property: 'og:url', content: config.public.siteUrl.replace(/\/$/, '') + route.path }],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
