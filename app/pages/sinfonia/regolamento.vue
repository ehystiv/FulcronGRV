<script setup lang="ts">
const page = await usePage('regolamento')
</script>

<template>
  <article class="container-site py-[clamp(3rem,8vw,5.5rem)]">
    <div class="mx-auto max-w-[72ch]">
      <h1 class="mb-3 text-[clamp(2.2rem,5vw,3.6rem)]">{{ page.title }}</h1>
      <p v-if="page.lead" class="text-[clamp(1.1rem,2vw,1.25rem)] text-muted">{{ page.lead }}</p>
      <ContentRenderer
        :value="page"
        class="prose-fulcron [&_h2]:mt-10 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-10"
      />
    </div>
  </article>
</template>
