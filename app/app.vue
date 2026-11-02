<script setup lang="ts">
const route = useRoute()
const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

useHead(() => ({
  titleTemplate: (title?: string) =>
    title && title !== 'FulcronGRV' ? `${title} · FulcronGRV` : 'FulcronGRV · Gioco di ruolo dal vivo',
  // Canonical URL + og:url for every page
  link: [{ rel: 'canonical', href: siteUrl + route.path }],
  meta: [{ property: 'og:url', content: siteUrl + route.path }],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
