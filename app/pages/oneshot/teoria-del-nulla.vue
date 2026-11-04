<script setup lang="ts">
// Rebuild of the original event website: one page of black and marble, after the event poster
import '~/assets/css/teoria.css'

const page = await usePage('teoria-del-nulla')

const sections = [
  ['larp', 'LARP?'],
  ['ambientazione', 'Ambientazione'],
  ['caste', 'Caste'],
  ['personaggi', 'Personaggi'],
  ['esperienza', 'Esperienza'],
  ['costumi', 'Costumi'],
  ['location', 'Location'],
  ['programma', 'Programma'],
  ['giocare-sicuri', 'Giocare sicuri'],
  ['chi-siamo', 'Chi siamo'],
] as const

// Highlights the section being read. Without JavaScript the links simply work
const current = ref('')
const nav = ref<HTMLElement>()
let observer: IntersectionObserver | undefined

watch(current, async (id) => {
  await nextTick()
  const link = nav.value?.querySelector<HTMLElement>(`[href="#${id}"]`)
  if (link && nav.value) nav.value.scrollTo({ left: link.offsetLeft - 16 })
})

onMounted(() => {
  // A band in the upper part of the screen: the section crossing it is the one being read
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) current.value = entry.target.id
    },
    { rootMargin: '-25% 0px -70% 0px' },
  )
  for (const [id] of sections) {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="teoria">
    <header class="teoria-hero">
      <img
        src="/oneshot/teoria-del-nulla/filo-spinato.jpg"
        alt=""
        width="1450"
        height="740"
        fetchpriority="high"
        class="teoria-hero__photo"
      />
      <h1>{{ page.title }}</h1>
      <p class="teoria-hero__date">{{ page.date }}</p>
      <TeoriaEye class="teoria-hero__eye" />
      <div class="teoria-hero__foot">
        <p class="teoria-hero__lead">{{ page.lead }}</p>
        <p class="teoria-hero__status">{{ page.place }} · Evento concluso · pagina d’archivio</p>
      </div>
    </header>

    <nav ref="nav" class="teoria-nav" aria-label="Sezioni della pagina">
      <a
        v-for="[id, label] in sections"
        :key="id"
        :href="`#${id}`"
        :aria-current="current === id ? 'location' : undefined"
      >
        {{ label }}
      </a>
    </nav>

    <ContentRenderer :value="page" />

    <footer class="teoria-end">
      <img src="/logos/logo_bianco_trim.png" alt="FulcronGRV" width="96" height="96" loading="lazy" />
      <p>
        <NuxtLink to="/oneshot">Le altre oneshot</NuxtLink>
        <a href="https://www.instagram.com/fulcrongrv">I prossimi eventi su Instagram</a>
      </p>
    </footer>
  </div>
</template>
