<script setup lang="ts">
const route = useRoute()
const isOverview = computed(() => route.path.replace(/\/$/, '') === '/sinfonia')

const hasNews = useHasNews()
const tabs = computed(() => [
  { to: '/sinfonia', label: 'Panoramica' },
  { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
  { to: '/sinfonia/regolamento', label: 'Regolamento' },
  ...(hasNews.value ? [{ to: '/sinfonia/bacheca', label: 'Bacheca' }] : []),
])

// On phones the tabs scroll sideways: keep the current one in view
const strip = ref<HTMLElement>()
const showActive = () =>
  nextTick(() => {
    const el = strip.value
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!el || !active || el.scrollWidth <= el.clientWidth) return
    el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2
  })
onMounted(showActive)
watch(() => route.path, showActive)
</script>

<template>
  <div>
    <header
      class="bg-[radial-gradient(ellipse_at_top,rgb(184_145_63/0.12),transparent_70%),linear-gradient(180deg,var(--color-surface-2),transparent)]"
    >
      <div class="container-site flex flex-col items-center pt-6 pb-3 text-center">
        <!-- The overview page has no title of its own: here the campaign name is its h1 -->
        <h1 v-if="isOverview" class="m-0 py-2 text-[clamp(2.2rem,5vw,3.6rem)]">La Sinfonia dei Sette</h1>
        <template v-else>
          <span class="eyebrow mb-1">La campagna</span>
          <p class="font-display text-[clamp(1.5rem,3vw,2rem)] tracking-wide text-ink">La Sinfonia dei Sette</p>
        </template>
      </div>
    </header>

    <nav
      class="top-header z-20 border-b border-line bg-parchment/92 backdrop-blur-md sm:sticky"
      aria-label="Sezioni della Sinfonia dei Sette"
    >
      <!-- The fade on the right edge (phones only) hints that the strip scrolls -->
      <div
        ref="strip"
        class="container-site flex justify-center-safe gap-1 overflow-x-auto [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_82%,transparent)]"
      >
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex h-tabs shrink-0 items-center border-b-2 border-transparent px-3.5 sm:px-5 text-[0.92rem] font-semibold tracking-wide text-muted no-underline hover:text-ink"
          :active-class="tab.to === '/sinfonia' ? undefined : '!border-gold !text-ink'"
          exact-active-class="!border-gold !text-ink"
        >
          {{ tab.label }}
        </NuxtLink>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>
