<script setup lang="ts">
// Map of Fulcron: ::world-map
// A preview of the interactive map of the Ring, which opens on its own page (/wiki/mappa).
const SRC = '/mappa/anello.jpg'
const ALT = 'Mappa di Fulcron: l’Anello di terre attorno al Mare Interno, diviso tra Nord, Est, Sud e Ovest'
</script>

<template>
  <figure class="not-prose mx-auto my-8 max-w-xl">
    <NuxtLink
      to="/wiki/mappa"
      class="group relative block w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
    >
      <SiteImage
        :src="SRC"
        :alt="ALT"
        width="1240"
        height="1240"
        sizes="sm:100vw md:576px"
        class="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <span
        class="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-ink-deep/85 px-4 py-2 text-sm font-semibold text-on-dark backdrop-blur-sm"
      >
        <AppIcon name="map" :size="16" />
        Apri la mappa interattiva
      </span>
    </NuxtLink>
    <figcaption class="mt-2 text-center text-sm text-muted">
      La mappa dell’Anello: cerca un luogo, ingrandisci e leggi le schede della wiki.
    </figcaption>
  </figure>
</template>
