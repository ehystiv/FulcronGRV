<script setup lang="ts">
import type { WikiNavItem } from './WikiNav.vue'

defineProps<{ items: WikiNavItem[] }>()
</script>

<template>
  <nav aria-label="Pagine della wiki">
    <NuxtLink
      to="/wiki"
      class="relative mb-2 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.92rem] font-semibold tracking-wide text-gold-ink no-underline hover:bg-surface-2 max-lg:py-3"
      exact-active-class="!bg-surface-2 before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-gold notte:before:shadow-luce"
    >
      <AppIcon name="book" :size="16" />
      Inizio
    </NuxtLink>
    <WikiNav :items="items" />
  </nav>
</template>
