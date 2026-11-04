<script setup lang="ts">
const page = await usePage('privacy')
</script>

<template>
  <div>
    <PageHero :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" />
    <article class="container-site py-[clamp(3rem,8vw,5.5rem)]">
      <div class="mx-auto max-w-reading">
        <p v-if="page.updated" class="text-muted">Ultimo aggiornamento: {{ page.updated }}</p>
        <ContentRenderer :value="page" class="prose-fulcron" />
      </div>
    </article>
  </div>
</template>
