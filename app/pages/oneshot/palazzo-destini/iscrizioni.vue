<script setup lang="ts">
const page = await usePage('palazzo-destini-iscrizioni')
</script>

<template>
  <PalazzoShell>
    <section
      class="mt-10 bg-[linear-gradient(90deg,transparent,#fff_6%,#fff_94%,transparent)] py-10 text-ink-deep md:bg-[linear-gradient(90deg,transparent,#fff_30%,#fff_70%,transparent)]"
    >
      <div class="container-site mx-auto max-w-3xl">
        <h1
          class="mb-6 text-center font-cardinal text-[clamp(2.6rem,6vw,4rem)] font-normal tracking-normal text-ink-deep"
        >
          Iscrizioni
        </h1>
        <ContentRenderer :value="page" class="[&_p]:mb-4" />
        <div class="mt-6 flex justify-center">
          <NuxtLink
            to="/oneshot/palazzo-destini"
            class="rounded-md border-2 border-ink-deep/20 bg-white px-5 py-3 text-sm font-bold tracking-wider text-ink-deep uppercase no-underline hover:bg-gold-soft"
          >
            Torna al Palazzo
          </NuxtLink>
        </div>
      </div>
    </section>
  </PalazzoShell>
</template>
