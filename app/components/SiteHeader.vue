<script setup lang="ts">
const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

// Transparent over the home hero, solid everywhere else and after scrolling
const transparent = computed(() => route.path === '/' && !scrolled.value && !open.value)

const onScroll = () => (scrolled.value = window.scrollY > 24)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.fullPath,
  () => (open.value = false),
)

const isActive = (link: { to: string; match?: string }) =>
  link.to === '/' ? route.path === '/' : route.path.startsWith(link.match ?? link.to)

const linkClass =
  'rounded-full px-3.5 py-2 text-[0.92rem] font-medium tracking-wide text-on-dark no-underline hover:text-gold-soft'
const ctaClass =
  'rounded-full border border-gold px-4 py-2 text-[0.88rem] font-semibold tracking-wide whitespace-nowrap text-gold-soft no-underline transition-colors hover:bg-gold hover:text-ink-deep'
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b text-on-dark transition-colors duration-300"
    :class="transparent ? 'border-transparent bg-transparent' : 'border-gold-soft/20 bg-ink-deep/92 backdrop-blur-md'"
  >
    <div class="container-site flex h-header items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 font-display text-[1.35rem] tracking-wider text-inherit no-underline hover:text-gold-soft"
        aria-label="FulcronGRV, vai alla home"
      >
        <img src="/logos/logo_bianco.png" alt="" width="36" height="36" />
        <span>FulcronGRV</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          :class="[linkClass, isActive(link) && 'text-gold-soft underline decoration-1 underline-offset-8']"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/inizia-a-giocare" :class="[ctaClass, 'ml-2']" active-class="bg-gold !text-ink-deep">
          Inizia a giocare
        </NuxtLink>
      </nav>

      <button
        type="button"
        class="grid size-11 place-items-center rounded-full hover:bg-white/10 lg:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Chiudi il menu' : 'Apri il menu'"
        @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'menu'" :size="26" />
      </button>
    </div>

    <nav
      v-show="open"
      id="mobile-nav"
      class="container-site flex flex-col border-t border-gold-soft/20 bg-ink-deep pt-2 pb-5 lg:hidden"
      aria-label="Navigazione principale"
    >
      <NuxtLink
        v-for="link in NAV_LINKS"
        :key="link.to"
        :to="link.to"
        class="border-b border-white/5 px-1 py-3.5 text-[1.05rem] text-on-dark no-underline"
        :class="isActive(link) && 'text-gold-soft'"
        :aria-current="isActive(link) ? 'page' : undefined"
      >
        {{ link.label }}
      </NuxtLink>
      <NuxtLink to="/inizia-a-giocare" :class="[ctaClass, 'mt-4 py-3 text-center']">Inizia a giocare</NuxtLink>
    </nav>
  </header>
</template>
