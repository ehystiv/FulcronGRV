<script setup lang="ts">
const tabs = [
  { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
  { to: '/sinfonia/regolamento', label: 'Regolamento' },
  { to: '/sinfonia/bacheca', label: 'Bacheca' },
]
</script>

<template>
  <div>
    <header class="band">
      <div class="container band-inner">
        <span class="eyebrow">La campagna</span>
        <p class="band-title">La Sinfonia dei Sette</p>
      </div>
    </header>
    <nav class="tabs" aria-label="Sezioni della Sinfonia dei Sette">
      <div class="container tabs-inner">
        <NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to" class="tab">{{ tab.label }}</NuxtLink>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>

<style scoped>
.band {
  background:
    radial-gradient(ellipse at top, rgb(184 145 63 / 0.12), transparent 70%),
    linear-gradient(180deg, var(--surface-2), transparent);
}
.band-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 1.5rem 0.75rem;
  text-align: center;
}
.band .eyebrow {
  margin-bottom: 0.2rem;
}
.band-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  letter-spacing: 0.03em;
  color: var(--ink);
}
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
  display: flex;
  align-items: center;
  height: var(--tabs-h);
  padding: 0 1.2rem;
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
