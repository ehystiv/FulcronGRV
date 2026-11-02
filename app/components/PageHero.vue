<script setup lang="ts">
defineProps<{ title: string; eyebrow?: string; lead?: string; as?: 'h1' | 'h2' }>()
</script>

<template>
  <header class="page-hero">
    <div class="container">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <component :is="as ?? 'h1'" class="hero-title">{{ title }}</component>
      <div class="divider" aria-hidden="true"><span /></div>
      <p v-if="lead" class="lead">{{ lead }}</p>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
}
</style>
