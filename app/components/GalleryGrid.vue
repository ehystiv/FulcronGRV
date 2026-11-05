<script setup lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

// Justified rows: every photo starts from the same height and grows in proportion to its
// ratio, so a row keeps one height and nothing is cropped. It needs no JavaScript, and each
// thumbnail is a link to the large photo until the viewer has loaded.
const props = defineProps<{
  album: string
  title: string
  photos: { file: string; width: number; height: number }[]
}>()

const base = useRuntimeConfig().public.galleryUrl
const url = (size: 'thumb' | 'large', file: string) => `${base}/${props.album}/${size}/${file}`

const grid = ref<HTMLElement>()
let lightbox: PhotoSwipeLightbox | undefined

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({
    gallery: grid.value,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.94,
    closeTitle: 'Chiudi',
    zoomTitle: 'Ingrandisci',
    arrowPrevTitle: 'Foto precedente',
    arrowNextTitle: 'Foto successiva',
    errorMsg: 'Questa foto non si riesce a caricare.',
    indexIndicatorSep: '/',
  })
  lightbox.init()
})
onBeforeUnmount(() => lightbox?.destroy())
</script>

<template>
  <ul ref="grid" class="gallery-grid">
    <li v-for="(photo, i) in photos" :key="photo.file" :style="{ '--ratio': photo.width / photo.height }">
      <a
        :href="url('large', photo.file)"
        :data-pswp-width="photo.width"
        :data-pswp-height="photo.height"
        :aria-label="`Apri la foto ${i + 1} di ${photos.length}`"
      >
        <img
          :src="url('thumb', photo.file)"
          :alt="`${title}, foto ${i + 1}`"
          :width="photo.width"
          :height="photo.height"
          loading="lazy"
          decoding="async"
        />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.gallery-grid {
  --row: clamp(9.5rem, 21vw, 17rem);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Keeps the last row at its natural size instead of stretching it */
.gallery-grid::after {
  content: '';
  flex-grow: 1000;
}

.gallery-grid li {
  flex-grow: var(--ratio);
  flex-basis: calc(var(--ratio) * var(--row));
  min-width: 0;
  aspect-ratio: var(--ratio);
  background: var(--color-surface-2);
}

.gallery-grid a {
  display: block;
  height: 100%;
}

.gallery-grid a:focus-visible {
  outline: 2px solid var(--color-gold-ink);
  outline-offset: 2px;
}

.gallery-grid img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.25s ease-out;
}

@media (hover: hover) {
  .gallery-grid a:hover img {
    filter: brightness(1.08);
  }
}
</style>

<style>
/* Not scoped: PhotoSwipe mounts the viewer on <body>. The dark ground keeps the counter readable
   on bright photos, which can reach the top of the screen. */
.pswp__counter {
  padding-inline: 0.7rem;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.6);
  font-size: 0.95rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-shadow: none;
  opacity: 1;
}
</style>
