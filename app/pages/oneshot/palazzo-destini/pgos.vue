<script setup lang="ts">
const page = await usePage('palazzo-destini-pgos')

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII']
const cards = computed(() =>
  (page.value.cards ?? []).map((name, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      name,
      numeral: ROMAN[i] ?? String(i + 1),
      front: `/oneshot/palazzo-destini/tarocchi/fronte-${n}.webp`,
      back: `/oneshot/palazzo-destini/tarocchi/retro-${n}.webp`,
    }
  }),
)
</script>

<template>
  <PalazzoShell>
    <header class="container-site pt-12 text-center">
      <p class="mb-3 font-display text-sm tracking-[0.3em] text-gold-soft uppercase">Personaggi Giocanti One Shot</p>
      <h1
        class="mt-2 font-cardinal text-[clamp(4rem,12vw,7rem)] leading-none font-normal tracking-normal text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.8)]"
      >
        PGOS
      </h1>
    </header>

    <ContentRenderer :value="page" />

    <section class="container-site" aria-labelledby="tarocchi">
      <h2 id="tarocchi" class="text-center font-cardinal text-[clamp(2.2rem,5vw,3.4rem)] font-normal tracking-normal text-white">
        I tredici Teaser
      </h2>
      <p class="mt-2 text-center text-white/80">Tocca una carta per girarla e leggere il suo Teaser.</p>

      <ul class="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-3">
        <li v-for="card in cards" :key="card.name" v-reveal class="flex flex-col items-center">
          <PalazzoTarotCard :name="card.name" :front="card.front" :back="card.back" />
          <p class="mt-4 text-center leading-tight">
            <span class="block font-display text-sm tracking-[0.25em] text-gold-soft">{{ card.numeral }}</span>
            <span class="font-cardinal text-[clamp(1.35rem,3vw,1.7rem)] text-white">{{ card.name }}</span>
          </p>
        </li>
      </ul>
    </section>
  </PalazzoShell>
</template>
