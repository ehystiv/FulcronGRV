<script setup lang="ts">
useSeoMeta({
  title: 'Oneshot',
  description:
    'Gli eventi oneshot di FulcronGRV: avventure di gioco di ruolo dal vivo autoconclusive con ambientazioni sempre diverse.',
})

const { data: oneshots } = await useAsyncData('oneshot', () => queryCollection('oneshot').order('date', 'DESC').all(), {
  default: () => [],
})

// The most recent oneshot with its own page is shown in evidence, the others in the grid
const featured = computed(() => oneshots.value.find((o) => o.page))
const others = computed(() => oneshots.value.filter((o) => o !== featured.value))

const when = (o: { date?: string | Date; place?: string }) =>
  [o.date && new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(new Date(o.date)), o.place]
    .filter(Boolean)
    .join(' · ')
</script>

<template>
  <div>
    <PageHero
      eyebrow="Avventure singole"
      title="Oneshot"
      lead="Storie che iniziano e finiscono nello stesso evento, spesso in un mondo tutto loro e con regole proprie."
    />

    <div class="container-site py-[clamp(3rem,8vw,5.5rem)]">
      <EmptyState v-if="!oneshots.length">Non ci sono ancora oneshot in archivio.</EmptyState>

      <UiCard
        v-if="featured"
        :to="featured.page"
        class="ornate mb-12 md:flex-row"
        media-class="md:w-[45%] md:min-h-70 md:shrink-0 aspect-16/10 md:aspect-auto"
        :image="featured.image"
        :image-alt="`Locandina di ${featured.title}`"
        image-sizes="sm:100vw md:540px"
      >
        <div class="flex flex-1 flex-col justify-center md:px-6 md:py-4">
          <span class="eyebrow">{{ when(featured) }}</span>
          <h2 class="mb-2 font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-normal">{{ featured.title }}</h2>
          <ContentRenderer :value="featured" class="prose-fulcron prose-base text-muted" />
          <span
            class="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.92rem] font-semibold text-on-dark transition group-hover:bg-teal"
          >
            Visita la pagina dell’evento <AppIcon name="arrow-right" :size="16" />
          </span>
        </div>
      </UiCard>

      <div v-if="others.length" class="grid gap-[clamp(1rem,2.5vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-3">
        <UiCard
          v-for="(oneshot, i) in others"
          :key="oneshot.path"
          v-reveal="(i % 3) * 100"
          :image="oneshot.image"
          :image-alt="`Locandina di ${oneshot.title}`"
          :hover="false"
          media-class="aspect-4/5"
        >
          <h2 class="mb-1 font-heading text-[1.45rem] tracking-normal">{{ oneshot.title }}</h2>
          <p class="mb-3 text-sm text-muted">{{ ['Evento concluso', when(oneshot)].filter(Boolean).join(' · ') }}</p>
          <TagList :tags="oneshot.tags" />
          <ContentRenderer :value="oneshot" class="prose-fulcron prose-base" />
          <div v-if="oneshot.page || oneshot.photos?.startsWith('http')" class="mt-auto flex flex-wrap gap-2 pt-4">
            <UiButton v-if="oneshot.page" :to="oneshot.page" size="sm" icon-right="arrow-right">
              Visita la pagina dell’evento
            </UiButton>
            <!-- The gallery is disabled for now: only external photo albums are linked -->
            <UiButton
              v-if="oneshot.photos?.startsWith('http')"
              :href="oneshot.photos"
              variant="outline"
              size="sm"
              icon="image"
            >
              Foto dell’evento
            </UiButton>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>
