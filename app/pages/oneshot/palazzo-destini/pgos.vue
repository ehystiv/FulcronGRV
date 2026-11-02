<script setup lang="ts">
const page = await usePage('palazzo-destini-pgos')
const cards = computed(() =>
  (page.value.cards ?? []).map((name, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      name,
      front: `/oneshot/palazzo-destini/tarocchi/fronte-${n}.webp`,
      back: `/oneshot/palazzo-destini/tarocchi/retro-${n}.webp`,
    }
  }),
)
</script>

<template>
  <PalazzoShell>
    <div class="container-site">
      <h1 class="my-8 text-center font-cardinal text-[clamp(4rem,12vw,7rem)] font-normal tracking-normal text-white">
        PGOS
      </h1>

      <ContentRenderer
        :value="page"
        class="mx-auto max-w-2xl text-center text-lg text-white/90 [&_hr]:mx-auto [&_hr]:my-8 [&_hr]:w-1/4 [&_hr]:border-white [&_p]:mb-4 [&_strong]:text-white"
      />

      <ul class="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        <li v-for="card in cards" :key="card.name" v-reveal>
          <PalazzoTarotCard :name="card.name" :front="card.front" :back="card.back" />
          <p class="mt-2 text-center font-cardinal text-xl text-white/80">{{ card.name }}</p>
        </li>
      </ul>
    </div>
  </PalazzoShell>
</template>
