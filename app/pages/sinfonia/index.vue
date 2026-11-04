<script setup lang="ts">
// Overview of the campaign: what it is, where the story is, how to start
const page = await usePage('sinfonia')
</script>

<template>
  <div class="container-site py-[clamp(2.5rem,6vw,4.5rem)]">
    <p v-if="page.lead" class="mx-auto mb-10 max-w-[46ch] text-center text-[clamp(1.1rem,2vw,1.25rem)] text-muted">
      {{ page.lead }}
    </p>
    <SiteImage
      v-if="page.image"
      :src="page.image"
      alt="Scena di gioco della campagna La Sinfonia dei Sette"
      sizes="sm:100vw md:900px"
      class="mx-auto mb-12 aspect-16/9 w-full max-w-225 rounded-card object-cover shadow-card"
    />
    <ContentRenderer :value="page" class="prose-fulcron mx-auto max-w-reading" />
    <div class="mt-16">
      <NextEvent />
    </div>
  </div>
</template>
