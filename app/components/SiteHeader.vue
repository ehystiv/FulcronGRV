<script setup lang="ts">
const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

// Transparent over the home hero, solid everywhere else / after scrolling.
const overHero = computed(() => route.path === '/' && !scrolled.value && !open.value)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

watch(
  () => route.fullPath,
  () => (open.value = false),
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function isActive(link: { to: string; match?: string }) {
  if (link.to === '/') return route.path === '/'
  return route.path.startsWith(link.match ?? link.to)
}
</script>

<template>
  <header class="site-header" :class="{ 'is-transparent': overHero, 'is-open': open }">
    <div class="container bar">
      <NuxtLink to="/" class="brand" aria-label="FulcronGRV, vai alla home">
        <img src="/logos/logo_bianco.png" alt="" width="36" height="36" />
        <span>FulcronGRV</span>
      </NuxtLink>

      <nav class="nav-desktop" aria-label="Navigazione principale">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/inizia-a-giocare" class="nav-cta">Inizia a giocare</NuxtLink>
      </nav>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Chiudi il menu' : 'Apri il menu'"
        @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'menu'" :size="26" />
      </button>
    </div>

    <nav id="mobile-nav" class="nav-mobile" :hidden="!open" aria-label="Navigazione principale">
      <NuxtLink
        v-for="link in NAV_LINKS"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ active: isActive(link) }"
        :aria-current="isActive(link) ? 'page' : undefined"
      >
        {{ link.label }}
      </NuxtLink>
      <NuxtLink to="/inizia-a-giocare" class="nav-cta nav-cta--mobile">Inizia a giocare</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: var(--on-dark);
  background: color-mix(in srgb, var(--ink-deep) 92%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgb(217 191 127 / 0.18);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
.site-header.is-transparent {
  background: transparent;
  backdrop-filter: none;
  border-bottom-color: transparent;
}
.bar {
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: inherit;
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: 0.04em;
}
.brand:hover {
  color: var(--gold-soft);
}
.nav-desktop {
  display: none;
  align-items: center;
  gap: 0.15rem;
}
.nav-link {
  position: relative;
  color: var(--on-dark);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
}
.nav-link:hover {
  color: var(--gold-soft);
}
.nav-link.active {
  color: var(--gold-soft);
}
.nav-desktop .nav-link.active::after {
  content: '';
  position: absolute;
  left: 0.85rem;
  right: 0.85rem;
  bottom: 0.2rem;
  height: 1px;
  background: currentColor;
}
.nav-cta {
  margin-left: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--gold);
  color: var(--gold-soft);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.nav-cta:hover,
.nav-cta.router-link-active {
  background: var(--gold);
  color: var(--ink-deep);
}
.nav-cta--mobile {
  margin: 1rem 0 0;
  text-align: center;
  padding: 0.75rem 1rem;
}
.menu-toggle {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.menu-toggle:hover {
  background: rgb(255 255 255 / 0.08);
}
.nav-mobile {
  display: flex;
  flex-direction: column;
  padding: 0.5rem var(--gutter) 1.25rem;
  border-top: 1px solid rgb(217 191 127 / 0.18);
}
.nav-mobile[hidden] {
  display: none;
}
.nav-mobile .nav-link {
  padding: 0.85rem 0.25rem;
  font-size: 1.05rem;
  border-radius: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
}
.site-header.is-open {
  background: var(--ink-deep);
}

@media (min-width: 1080px) {
  .nav-desktop {
    display: flex;
  }
  .menu-toggle,
  .nav-mobile {
    display: none !important;
  }
}
</style>
