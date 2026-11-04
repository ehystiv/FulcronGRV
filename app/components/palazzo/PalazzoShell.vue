<script setup lang="ts">
// Dark frame shared by the three pages of "Il Palazzo dei Destini Incrociati"
withDefaults(defineProps<{ stars?: boolean }>(), { stars: true })

const links = [
  { to: '/oneshot/palazzo-destini', label: 'Il Palazzo' },
  { to: '/oneshot/palazzo-destini/pgos', label: 'I PGOS' },
  { to: '/oneshot/palazzo-destini/iscrizioni', label: 'Iscrizioni' },
]
</script>

<template>
  <div class="on-dark relative isolate min-h-screen bg-black pb-16 text-white">
    <PalazzoStarField v-if="stars" />

    <!-- Section tabs: big touch targets, always reachable under the site header -->
    <nav
      class="sticky top-header z-30 border-b border-gold-soft/20 bg-black/80 backdrop-blur-md"
      aria-label="Il Palazzo dei Destini Incrociati"
    >
      <ul class="container-site grid h-tabs grid-cols-3 sm:mx-auto sm:max-w-2xl">
        <li v-for="link in links" :key="link.to" class="flex">
          <NuxtLink
            :to="link.to"
            class="relative flex flex-1 items-center justify-center font-cardinal text-[clamp(1.25rem,3.6vw,1.6rem)] leading-none text-white/75 no-underline transition-colors after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-gold-soft after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-50"
            exact-active-class="!text-gold-soft after:!scale-x-100"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <slot />
  </div>
</template>
