<script setup lang="ts">
defineProps<{ items: { href: string; title: string; size: string }[] }>()
</script>

<template>
  <ul class="not-prose grid list-none gap-3 p-0">
    <li v-for="doc in items" :key="doc.href">
      <a
        :href="doc.href"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-4 rounded-lg border border-line bg-surface px-5 py-4 text-ink no-underline transition hover:border-gold hover:shadow-card"
      >
        <AppIcon name="file" :size="28" />
        <span class="flex flex-1 flex-col leading-snug">
          <strong>{{ doc.title }}</strong>
          <span class="text-sm text-muted">PDF · {{ doc.size }}</span>
        </span>
        <AppIcon name="download" :size="20" class="text-gold" />
      </a>
    </li>
  </ul>
</template>
