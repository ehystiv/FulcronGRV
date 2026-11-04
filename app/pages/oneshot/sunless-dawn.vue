<script setup lang="ts">
// Rebuild of the original event website: 1950s noir, opening in the dark under a ceiling lamp
import '~/assets/css/sunless.css'

// The header must stay under the blackout: a page transition would trap the page in its own stacking context
definePageMeta({ pageTransition: false })

const page = await usePage('sunless-dawn')

// Before the first paint, so the page never flashes lit. Without JavaScript it simply stays lit
useHead({
  script: [{ innerHTML: "if(!location.hash)document.documentElement.classList.add('sd-dark')", tagPosition: 'head' }],
})
</script>

<template>
  <div class="sunless">
    <header class="sunless-hero">
      <SunlessLamp />
      <h1>{{ page.title }}</h1>
      <p class="sunless-hero__lead">{{ page.lead }}</p>
      <p class="sunless-hero__status">{{ page.date }} · Evento concluso · pagina d’archivio</p>
    </header>

    <ContentRenderer :value="page" />

    <footer class="sunless-end">
      <img src="/logos/logo_bianco_trim.png" alt="FulcronGRV" width="96" height="96" loading="lazy" />
      <p>
        <NuxtLink to="/oneshot">Le altre oneshot</NuxtLink>
        <a href="https://www.instagram.com/fulcrongrv">I prossimi eventi su Instagram</a>
      </p>
    </footer>
  </div>
</template>
