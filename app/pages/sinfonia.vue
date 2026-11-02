<script setup lang="ts">
const tabs = [
  { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
  { to: '/sinfonia/regolamento', label: 'Regolamento' },
  { to: '/sinfonia/bacheca', label: 'Bacheca' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="La campagna"
      title="La Sinfonia dei Sette"
      lead="Tutto quello che serve per entrare nel mondo di Fulcron: la sua storia, le regole del gioco e le ultime notizie dall’Anello."
      as="h2"
    />
    <nav class="tabs" aria-label="Sezioni della Sinfonia dei Sette">
      <div class="container tabs-inner">
        <NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to" class="tab">{{ tab.label }}</NuxtLink>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>

<style scoped>
.tabs {
  position: sticky;
  top: var(--header-h);
  z-index: 20;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.tabs-inner {
  display: flex;
  justify-content: safe center;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.tab {
  flex-shrink: 0;
  padding: 0.95rem 1.2rem;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
}
.tab:hover {
  color: var(--ink);
}
.tab.router-link-active {
  color: var(--ink);
  border-bottom-color: var(--gold);
}
</style>
