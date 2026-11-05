<script setup lang="ts">
const route = useRoute()
const slug = route.params.album as string

const { data: album } = await useAsyncData(`gallery-${slug}`, () =>
  queryCollection('gallery').where('stem', '=', `gallery/${slug}`).first(),
)
if (!album.value?.count) throw createError({ statusCode: 404, statusMessage: 'Album non trovato', fatal: true })

const month = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'Europe/Rome' })
const lead = computed(() =>
  [
    `${album.value!.count} foto`,
    album.value!.date && month.format(new Date(album.value!.date)),
    album.value!.place,
    album.value!.photographer && `Foto di ${album.value!.photographer}`,
  ]
    .filter(Boolean)
    .join(' · '),
)

useSeoMeta({
  title: () => `${album.value!.title} · Gallery`,
  description: () => `Le foto di ${album.value!.title}, un evento di FulcronGRV.`,
})
</script>

<template>
  <div v-if="album">
    <PageHero :title="album.title" :lead="lead" />

    <div class="mx-auto max-w-[110rem] px-1.5 py-[clamp(1.5rem,4vw,3rem)] sm:px-4">
      <GalleryGrid :album="slug" :title="album.title" :photos="album.photos ?? []" />
    </div>

    <footer class="container-site flex flex-wrap items-baseline justify-between gap-4 pb-[clamp(3rem,8vw,5.5rem)]">
      <NuxtLink to="/gallery" class="font-medium">Tutti gli album</NuxtLink>
      <p class="m-0 text-[0.92rem] text-muted">
        Ci sei in una foto e vuoi toglierla?
        <a :href="INSTAGRAM.href" target="_blank" rel="noopener">Scrivici su Instagram</a>.
      </p>
    </footer>
  </div>
</template>
