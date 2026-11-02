<script setup lang="ts">
defineProps<{ tags?: string[] }>()
</script>

<template>
  <ul v-if="tags?.length" class="mb-4 flex flex-wrap gap-1.5">
    <li
      v-for="tag in tags"
      :key="tag"
      class="rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-forest"
    >
      {{ tag }}
    </li>
  </ul>
</template>
