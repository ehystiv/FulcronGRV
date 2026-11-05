<script setup lang="ts">
const page = await usePage('eventi')
</script>

<template>
  <article class="container-site py-[clamp(3rem,8vw,5.5rem)]">
    <div class="mx-auto max-w-205">
      <h1 class="mb-3 text-[clamp(2.2rem,5vw,3.6rem)]">{{ page.title }}</h1>
      <p v-if="page.lead" class="mb-10 text-[clamp(1.1rem,2vw,1.25rem)] text-muted">{{ page.lead }}</p>
      <ContentRenderer :value="page" class="prose-fulcron" />
    </div>
  </article>
</template>
