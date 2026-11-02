<script setup lang="ts">
useSeoMeta({
  title: 'Oneshot',
  description:
    'Gli eventi oneshot di FulcronGRV: avventure di gioco di ruolo dal vivo autoconclusive con ambientazioni sempre diverse.',
})

const { data: oneshots } = await useAsyncData('oneshot', () => queryCollection('oneshot').order('date', 'DESC').all(), {
  default: () => [],
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Avventure singole"
      title="Oneshot"
      lead="Storie che iniziano e finiscono nello stesso evento, ognuna con il suo mondo e le sue regole."
    />

    <div class="container-site py-[clamp(3rem,8vw,5.5rem)]">
      <UiCard
        to="/oneshot/palazzo-destini"
        class="ornate mb-12 md:flex-row"
        media-class="md:w-[45%] md:min-h-70 md:shrink-0 aspect-16/10 md:aspect-auto"
        image="/oneshot/palazzo-destini/video-poster.jpg"
        image-sizes="sm:100vw md:540px"
      >
        <div class="flex flex-1 flex-col justify-center md:px-6 md:py-4">
          <span class="eyebrow">Aprile 2022 · Villa Achillini</span>
          <h2 class="mb-2 font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-normal">
            Il Palazzo dei Destini Incrociati
          </h2>
          <p class="text-muted">
            Un banchetto, un ospite misterioso, decine di destini che si intrecciano. Rivivi il sito dell’evento, con il
            trailer e i tarocchi dei tredici PGOS.
          </p>
          <span class="mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-teal">
            Scopri l’evento <AppIcon name="arrow-right" :size="16" />
          </span>
        </div>
      </UiCard>

      <EmptyState v-if="!oneshots.length">Non ci sono ancora oneshot in archivio.</EmptyState>

      <div v-else class="grid gap-[clamp(1rem,2.5vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-3">
        <UiCard
          v-for="(oneshot, i) in oneshots"
          :key="oneshot.path"
          v-reveal="(i % 3) * 100"
          :image="oneshot.image"
          :image-alt="`Locandina di ${oneshot.title}`"
        >
          <h2 class="mb-1 font-heading text-[1.45rem] tracking-normal">{{ oneshot.title }}</h2>
          <p class="mb-3 text-sm text-muted">
            <time :datetime="String(oneshot.date)">{{ formatDate(oneshot.date) }}</time>
          </p>
          <TagList :tags="oneshot.tags" />
          <ContentRenderer :value="oneshot" class="prose-fulcron prose-base" />
          <!-- The gallery is disabled for now: only external photo albums are linked -->
          <div v-if="oneshot.photos?.startsWith('http')" class="mt-auto pt-4">
            <UiButton :href="oneshot.photos" variant="outline" size="sm" icon="image">Foto dell’evento</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>
