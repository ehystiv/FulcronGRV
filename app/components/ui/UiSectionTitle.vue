<script setup lang="ts">
// Eyebrow + title + ornamental divider + optional lead, used by every section.
withDefaults(defineProps<{ title: string; eyebrow?: string; lead?: string; as?: 'h1' | 'h2' }>(), { as: 'h2' })
</script>

<template>
  <div class="text-center">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <component :is="as" class="mb-[0.4em]" :class="as === 'h1' ? 'text-title' : 'text-heading'">
      {{ title }}
    </component>
    <UiDivider />
    <p v-if="lead" class="mx-auto max-w-[46ch] text-lead text-muted">{{ lead }}</p>
    <slot />
  </div>
</template>
