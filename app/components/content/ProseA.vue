<script setup lang="ts">
// Links written in Markdown. Pages of the site open inside the app (NuxtLink); files in public/ such as PDFs and
// images are not pages, so they must be opened by the browser itself, in a new tab, or the app would show its 404.
const props = defineProps<{ href?: string; target?: string }>()
const file = computed(() => /\.(pdf|jpe?g|png|webp|gif|svg|mp3|mp4|zip|docx?)([?#].*)?$/i.test(props.href ?? ''))
</script>

<template>
  <a v-if="file" :href="href" :target="target ?? '_blank'" rel="noopener"><slot /></a>
  <NuxtLink v-else :href="href" :target="target"><slot /></NuxtLink>
</template>
