<script setup lang="ts">
// Grid of short cards (regions, races…): ::lore-tiles with `items` in YAML
withDefaults(defineProps<{ items: { title: string; text: string }[]; columns?: 1 | 2 }>(), { columns: 1 })
</script>

<template>
  <div class="not-prose mt-6 grid gap-4" :class="columns === 2 && 'md:grid-cols-2'">
    <div
      v-for="item in items"
      :key="item.title"
      v-reveal
      class="rounded-lg border border-l-[3px] border-line border-l-gold bg-surface px-[1.4rem] py-5"
    >
      <h3 class="mb-1.5 text-[1.3rem]">{{ item.title }}</h3>
      <p class="text-[0.98rem]">{{ item.text }}</p>
    </div>
  </div>
</template>
