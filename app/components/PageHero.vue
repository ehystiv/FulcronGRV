<script setup lang="ts">
defineProps<{ title: string; eyebrow?: string; lead?: string }>()
</script>

<template>
  <header
    class="border-b border-line bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-gold)_12%,transparent),transparent_60%),linear-gradient(180deg,var(--color-surface-2),var(--color-parchment))] pt-[clamp(3rem,9vw,6rem)] pb-[clamp(2.5rem,6vw,4rem)]"
  >
    <UiSectionTitle :title="title" :eyebrow="eyebrow" :lead="lead" as="h1" class="container-site">
      <slot />
    </UiSectionTitle>
  </header>
</template>
