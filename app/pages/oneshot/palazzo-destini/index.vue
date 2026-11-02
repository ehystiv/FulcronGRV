<script setup lang="ts">
// Rebuild of the original event website (palazzo-destini.netlify.app, April 2022)
const page = await usePage('palazzo-destini')
</script>

<template>
  <PalazzoShell>
    <section class="mt-6 flex justify-center bg-black">
      <video
        class="aspect-video w-full max-w-5xl"
        src="/oneshot/palazzo-destini/video.mp4"
        poster="/oneshot/palazzo-destini/video-poster.jpg"
        controls
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-label="Trailer de Il Palazzo dei Destini Incrociati"
      />
    </section>

    <div class="container-site mt-10 flex flex-col items-center text-center">
      <SiteImage
        src="/oneshot/palazzo-destini/castello.png"
        alt="Il castello, logo dell’evento"
        sizes="sm:80vw md:480px"
        loading="eager"
        class="w-[min(80vw,480px)] invert"
      />
      <h1 class="mt-6 font-cardinal text-[clamp(2.6rem,7vw,4.6rem)] font-normal tracking-normal text-white">
        {{ page.title }}
      </h1>
      <p class="mt-2 font-display text-[clamp(1.4rem,3vw,2rem)] text-white/90">{{ page.date }}</p>
      <p class="font-display text-[clamp(1.2rem,2.6vw,1.7rem)] text-white/80">{{ page.place }}</p>
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
  </PalazzoShell>
</template>
