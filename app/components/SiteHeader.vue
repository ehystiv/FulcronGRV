<script setup lang="ts">
const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

// Transparent over the home hero, solid everywhere else and after scrolling
const transparent = computed(() => route.path === '/' && !scrolled.value && !open.value)

const onScroll = () => (scrolled.value = window.scrollY > 24)

// Esc closes the phone menu and gives focus back to the menu button
const menuButton = ref<HTMLButtonElement>()
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || !open.value) return
  open.value = false
  menuButton.value?.focus()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => route.fullPath,
  () => (open.value = false),
)

const isActive = (link: { to: string; match?: string }) =>
  link.to === '/' ? route.path === '/' : route.path.startsWith(link.match ?? link.to)

// Desktop links: a gold underline grows from the left on hover and stays on the current section
const linkClass =
  'relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium tracking-wide text-on-dark no-underline transition-colors hover:text-gold-soft after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'
const ctaClass =
  'rounded-full border border-gold px-4 py-2 text-[0.88rem] font-semibold tracking-wide whitespace-nowrap text-gold-soft no-underline transition-colors hover:bg-gold hover:text-ink-deep'
</script>

<template>
  <header
    class="on-dark fixed inset-x-0 top-0 z-50 border-b text-on-dark transition-colors duration-300"
    :class="transparent ? 'border-transparent bg-transparent' : 'border-gold-soft/20 bg-ink-deep/92 backdrop-blur-md'"
  >
    <div class="container-site flex h-header items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 font-display text-[1.4rem] tracking-wider text-inherit no-underline hover:text-gold-soft"
        aria-label="FulcronGRV, vai alla home"
      >
        <NuxtImg src="/logos/logo_bianco_trim.png" alt="" width="40" height="40" densities="x1 x2" format="webp" />
        <span>FulcronGRV</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          :class="[linkClass, isActive(link) && 'text-gold-soft after:scale-x-100']"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/inizia-a-giocare" :class="[ctaClass, 'ml-2']" active-class="bg-gold !text-ink-deep">
          Inizia a giocare
        </NuxtLink>
      </nav>

      <button
        ref="menuButton"
        type="button"
        class="grid size-11 place-items-center rounded-full hover:bg-white/10 lg:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Chiudi il menu' : 'Apri il menu'"
        @click="open = !open"
      >
        <!-- Three lines that turn into an X: the outer lines move to the centre, then rotate.
             Only translate/rotate change, so no two classes compete for the same property. -->
        <span class="relative block h-4 w-6" aria-hidden="true">
          <span
            class="absolute top-0 left-0 h-0.5 w-6 rounded-full bg-current transition duration-300"
            :class="open && 'translate-y-[7px] rotate-45'"
          />
          <span
            class="absolute top-[7px] left-0 h-0.5 w-6 rounded-full bg-current transition duration-300"
            :class="open && 'scale-x-0 opacity-0'"
          />
          <span
            class="absolute top-[14px] left-0 h-0.5 w-6 rounded-full bg-current transition duration-300"
            :class="open && '-translate-y-[7px] -rotate-45'"
          />
        </span>
      </button>
    </div>

    <!-- Mobile menu: the panel slides down, the links follow one after the other -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="-translate-y-3 opacity-0"
      leave-to-class="-translate-y-3 opacity-0"
    >
      <nav
        v-show="open"
        id="mobile-nav"
        class="container-site flex flex-col border-t border-gold-soft/20 bg-ink-deep pt-2 pb-5 lg:hidden"
        aria-label="Menu principale"
      >
        <NuxtLink
          v-for="(link, i) in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="animate-menu-item border-b border-white/5 px-1 py-3.5 text-[1.05rem] text-on-dark no-underline"
          :class="isActive(link) && 'text-gold-soft'"
          :style="{ animationDelay: `${60 + i * 45}ms` }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/inizia-a-giocare"
          :class="[ctaClass, 'mt-4 animate-menu-item py-3 text-center']"
          :style="{ animationDelay: `${60 + NAV_LINKS.length * 45}ms` }"
        >
          Inizia a giocare
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
