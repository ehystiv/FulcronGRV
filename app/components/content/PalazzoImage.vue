<script setup lang="ts">
// Line art (inverted to white) or illustration (inverted keeping the gold accents)
withDefaults(defineProps<{ src: string; alt?: string; kind?: 'line' | 'illustration' }>(), { alt: '', kind: 'line' })
</script>

<template>
  <div v-reveal class="not-prose my-10 flex justify-center">
    <SiteImage
      :src="src"
      :alt="alt"
      sizes="sm:70vw md:420px"
      class="w-[min(70vw,420px)]"
      :class="kind === 'illustration' ? 'invert hue-rotate-180' : 'invert'"
    />
  </div>
</template>
