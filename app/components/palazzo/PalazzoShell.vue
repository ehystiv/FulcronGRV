<script setup lang="ts">
// Dark frame shared by the three pages of "Il Palazzo dei Destini Incrociati"
const links = [
  { to: '/oneshot/palazzo-destini', label: 'Il Palazzo' },
  { to: '/oneshot/palazzo-destini/pgos', label: 'I PGOS' },
  { to: '/oneshot/palazzo-destini/iscrizioni', label: 'Iscrizioni' },
]
</script>

<template>
  <div class="relative isolate min-h-screen bg-black pb-16 text-white">
    <PalazzoStarField />

    <nav class="border-b border-white/10 bg-black/60 backdrop-blur-sm" aria-label="Il Palazzo dei Destini Incrociati">
      <div class="container-site flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-3">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="font-cardinal text-xl text-white/70 no-underline transition-colors hover:text-white"
          exact-active-class="!text-gold-soft"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>

    <p class="container-site mt-4 text-center text-sm text-white/60">
      Evento del 23 e 24 aprile 2022 a Villa Achillini. Le iscrizioni sono chiuse: questa è la pagina originale
      dell’evento, conservata come archivio.
    </p>

    <slot />
  </div>
</template>
