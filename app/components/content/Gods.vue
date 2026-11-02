<script setup lang="ts">
defineProps<{ items: { name: string; role: string }[] }>()
</script>

<template>
  <ul class="not-prose grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5 p-0">
    <li v-for="god in items" :key="god.name" class="flex flex-col rounded-lg border border-line bg-surface px-4 py-3.5">
      <span class="font-heading text-xl text-ink">{{ god.name }}</span>
      <span class="text-muted">{{ god.role }}</span>
    </li>
  </ul>
</template>
