<script setup lang="ts">
defineProps<{ title: string; image?: string; imageAlt?: string }>()
</script>

<template>
  <section class="sunless-section">
    <div class="sunless-section__side">
      <h3>{{ title }}</h3>
      <SiteImage v-if="image" :src="image" :alt="imageAlt" sizes="sm:100vw md:400px" class="sunless-section__image" />
    </div>
    <div class="sunless-prose"><slot /></div>
  </section>
</template>
