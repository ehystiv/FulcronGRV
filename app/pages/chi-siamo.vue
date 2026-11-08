<script setup lang="ts">
const page = await usePage('chi-siamo')
</script>

<template>
  <article class="container-site pb-section">
    <ContentRenderer :value="page" class="prose-fulcron mx-auto max-w-reading" />
  </article>
</template>
