<script setup lang="ts">
const page = await usePage('chi-siamo')
</script>

<template>
  <article class="container-site pb-[clamp(3rem,8vw,5.5rem)]">
    <ContentRenderer :value="page" class="prose-fulcron mx-auto max-w-[72ch]" />
  </article>
</template>
