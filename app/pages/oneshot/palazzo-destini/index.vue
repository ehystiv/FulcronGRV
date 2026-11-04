<script setup lang="ts">
// Rebuild of the original event website (palazzo-destini.netlify.app, April 2022)
const page = await usePage('palazzo-destini')
</script>

<template>
  <PalazzoShell :stars="false">
    <PalazzoVideoBackground />

    <!-- First screen: the trailer, with just enough to say what this page is -->
    <section
      class="flex h-[calc(100svh-var(--spacing-header)-var(--spacing-tabs))] flex-col items-center justify-end gap-5 px-4 pb-14 text-center"
    >
      <div>
        <h1
          class="font-cardinal text-[clamp(2rem,5.5vw,3.4rem)] leading-tight font-normal tracking-normal text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.9)]"
        >
          {{ page.title }}
        </h1>
        <p class="mt-2 text-sm font-semibold text-white/85 [text-shadow:0_1px_8px_rgb(0_0_0/0.9)]">
          Evento concluso · pagina d’archivio
        </p>
      </div>
      <a
        href="#palazzo"
        class="flex flex-col items-center gap-1 text-sm font-semibold tracking-[0.2em] text-white uppercase no-underline [text-shadow:0_2px_10px_rgb(0_0_0/0.9)] hover:text-gold-soft"
      >
        Scorri
        <AppIcon name="chevron-down" :size="26" class="motion-safe:animate-bounce" />
      </a>
    </section>

    <!-- The content rises over the video on a dark veil that keeps the text readable -->
    <div id="palazzo" class="-mb-16 bg-[linear-gradient(to_bottom,transparent,rgb(0_0_0/0.78)_16rem)] pt-64 pb-16">
      <div class="container-site flex flex-col items-center text-center">
        <SiteImage
          src="/oneshot/palazzo-destini/castello.png"
          alt="Il castello, logo dell’evento"
          sizes="sm:80vw md:480px"
          class="w-[min(80vw,480px)] invert"
        />
        <p class="mt-6 font-display text-[clamp(1.4rem,3vw,2rem)] text-white">{{ page.date }}</p>
        <p class="font-display text-[clamp(1.2rem,2.6vw,1.7rem)] text-white/90">{{ page.place }}</p>
      </div>

      <ContentRenderer :value="page" />

      <div class="mt-12 flex justify-center">
        <img
          src="/logos/logo_bianco_trim.png"
          alt="FulcronGRV"
          width="120"
          height="120"
          loading="lazy"
          class="opacity-80"
        />
      </div>
    </div>
  </PalazzoShell>
</template>
