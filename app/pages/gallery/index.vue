<script setup lang="ts">
useSeoMeta({
  title: 'Gallery',
  description: 'Le foto degli eventi di FulcronGRV, album per album.',
})

const { galleryUrl } = useRuntimeConfig().public
const { data } = await useAsyncData(
  'gallery',
  () => queryCollection('gallery').select('stem', 'title', 'date', 'poster', 'cover', 'count', 'first').all(),
  { default: () => [] },
)

// Albums without a date go last; the JSON files of events still to be copied have no photos
const albums = computed(() =>
  data.value
    .filter((album) => album.count)
    .map((album) => {
      const slug = album.stem.split('/').pop()!
      return {
        ...album,
        slug,
        image: album.poster ?? `${galleryUrl}/${slug}/large/${album.cover ?? album.first}`,
      }
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')),
)

const year = (date?: string) => date?.slice(0, 4)
</script>

<template>
  <div>
    <PageHero title="Gallery" lead="Le foto dei nostri eventi, album per album." />

    <div class="container-site py-[clamp(3rem,8vw,5.5rem)]">
      <EmptyState v-if="!albums.length">Non ci sono ancora album.</EmptyState>

      <ul v-else class="m-0 grid list-none gap-x-6 gap-y-10 p-0 sm:grid-cols-2">
        <li v-for="album in albums" :key="album.slug">
          <NuxtLink :to="`/gallery/${album.slug}`" class="group block text-body no-underline hover:text-body">
            <!-- Posters carry titles and dates, so they are shown whole on a dark ground, never cropped -->
            <div class="aspect-3/2 overflow-hidden rounded-card" :class="album.poster ? 'bg-black' : 'bg-surface-2'">
              <SiteImage
                :src="album.image"
                :alt="album.poster ? `Locandina di ${album.title}` : `Foto dall'album ${album.title}`"
                sizes="sm:100vw md:50vw lg:600px"
                :class="album.poster ? 'object-contain' : 'object-cover'"
                class="size-full transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h2 class="mt-4 mb-1 font-heading text-[1.5rem] leading-tight group-hover:text-gold-ink">
              {{ album.title }}
            </h2>
            <p class="m-0 text-[0.92rem] text-muted tabular-nums">
              {{ [album.count + ' foto', year(album.date)].filter(Boolean).join(' · ') }}
            </p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
