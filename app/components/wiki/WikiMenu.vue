<script setup lang="ts">
import type { WikiNavItem } from './WikiNav.vue'

defineProps<{ items: WikiNavItem[] }>()
</script>

<template>
  <nav aria-label="Pagine della wiki">
    <NuxtLink
      to="/wiki"
      class="mb-1 block rounded-md px-2.5 py-1.5 text-[0.92rem] font-semibold text-ink no-underline hover:bg-surface-2 max-lg:py-3"
      exact-active-class="!bg-primary !text-on-dark"
    >
      Inizio
    </NuxtLink>
    <WikiNav :items="items" />
  </nav>
</template>
