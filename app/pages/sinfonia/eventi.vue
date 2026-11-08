<script setup lang="ts">
const page = await usePage('eventi')
</script>

<template>
  <article class="container-site py-section">
    <div class="mx-auto max-w-205">
      <h1 class="mb-3 text-title">{{ page.title }}</h1>
      <p v-if="page.lead" class="mb-10 text-lead text-muted">{{ page.lead }}</p>
      <ContentRenderer :value="page" class="prose-fulcron" />
    </div>
  </article>
</template>
