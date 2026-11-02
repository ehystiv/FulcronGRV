<script setup lang="ts">
const tabs = [
  { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
  { to: '/sinfonia/regolamento', label: 'Regolamento' },
  { to: '/sinfonia/bacheca', label: 'Bacheca' },
]
</script>

<template>
  <div>
    <header
      class="bg-[radial-gradient(ellipse_at_top,rgb(184_145_63/0.12),transparent_70%),linear-gradient(180deg,var(--color-surface-2),transparent)]"
    >
      <div class="container-site flex flex-col items-center pt-6 pb-3 text-center">
        <span class="eyebrow mb-1">La campagna</span>
        <p class="font-display text-[clamp(1.5rem,3vw,2rem)] tracking-wide text-ink">La Sinfonia dei Sette</p>
      </div>
    </header>

    <nav
      class="sticky top-header z-20 border-b border-line bg-parchment/92 backdrop-blur-md"
      aria-label="Sezioni della Sinfonia dei Sette"
    >
      <div class="container-site flex justify-center-safe gap-1 overflow-x-auto [scrollbar-width:none]">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex h-tabs shrink-0 items-center border-b-2 border-transparent px-3.5 sm:px-5 text-[0.92rem] font-semibold tracking-wide text-muted no-underline hover:text-ink"
          active-class="!border-gold !text-ink"
        >
          {{ tab.label }}
        </NuxtLink>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>
