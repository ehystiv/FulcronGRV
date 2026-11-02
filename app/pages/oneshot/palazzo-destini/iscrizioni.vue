<script setup lang="ts">
const page = await usePage('palazzo-destini-iscrizioni')
</script>

<template>
  <PalazzoShell>
    <section class="container-site my-12 md:my-16">
      <div
        class="mx-auto max-w-3xl rounded-2xl bg-[linear-gradient(180deg,#fff,#faf7f0)] px-6 py-9 text-ink-deep shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)] ring-1 ring-gold/35 md:px-14 md:py-12"
      >
        <h1
          class="text-center font-cardinal text-[clamp(2.6rem,6vw,4rem)] leading-tight font-normal tracking-normal text-ink-deep"
        >
          Iscrizioni
        </h1>
        <img
          src="/oneshot/palazzo-destini/ornamento.png"
          alt=""
          width="700"
          height="400"
          class="mx-auto my-3 mb-6 w-40 opacity-80"
        />
        <ContentRenderer :value="page" class="leading-relaxed [&_p]:mb-4" />
        <div class="mt-8 flex justify-center">
          <UiButton to="/oneshot/palazzo-destini" variant="gold" icon="chevron-left">Torna al Palazzo</UiButton>
        </div>
      </div>
    </section>
  </PalazzoShell>
</template>
