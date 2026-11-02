<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: albums } = await useAsyncData(
  'gallery-albums',
  () => queryCollection('gallery').order('date', 'DESC').all(),
  { default: () => [] },
)
const { data, status, error, refresh } = await useFetch(() => `/api/gallery/${slug.value}`)

const album = computed(() => albums.value.find((a) => albumFolder(a) === slug.value))
const title = computed(() => album.value?.title ?? slug.value.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()))
const photos = computed(() => data.value?.photos ?? [])
const notFound = computed(() => error.value?.statusCode === 404)
if (import.meta.server && notFound.value) setResponseStatus(useRequestEvent()!, 404)

useHead({ title })

// ---------- Lightbox ----------
const current = ref<number | null>(null)
const dialog = ref<HTMLDialogElement>()

function open(index: number) {
  current.value = index
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}
function step(delta: number) {
  if (current.value === null || !photos.value.length) return
  current.value = (current.value + delta + photos.value.length) % photos.value.length
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

// Swipe support on touch screens
let touchX: number | null = null
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? null
}
function onTouchEnd(e: TouchEvent) {
  const end = e.changedTouches[0]?.clientX
  if (touchX === null || end === undefined) return
  const dx = end - touchX
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
  touchX = null
}
</script>

<template>
  <div>
    <PageHero eyebrow="Gallery" :title="title" :lead="album ? formatDate(album.date) : undefined">
      <NuxtLink to="/gallery" class="back"><AppIcon name="chevron-left" :size="16" /> Tutti gli album</NuxtLink>
    </PageHero>

    <div class="container section">
      <div v-if="notFound" class="empty">
        <p>Le foto di questo album non sono ancora disponibili.</p>
        <NuxtLink to="/gallery" class="btn btn-outline">Torna alla gallery</NuxtLink>
      </div>
      <StateMessage
        v-else
        :status="status"
        :empty="!photos.length"
        empty-text="Questo album è ancora vuoto."
        @retry="refresh()"
      />

      <ul v-if="photos.length" class="photos">
        <li v-for="(src, i) in photos" :key="src">
          <button
            type="button"
            class="thumb"
            :aria-label="`Apri la foto ${i + 1} di ${photos.length}`"
            @click="open(i)"
          >
            <img
              :src="`${src}?w=480`"
              :srcset="`${src}?w=480 480w, ${src}?w=960 960w`"
              sizes="(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        </li>
      </ul>
    </div>

    <dialog
      ref="dialog"
      class="lightbox"
      aria-label="Visualizzatore foto"
      @keydown="onKey"
      @close="current = null"
      @click.self="close"
    >
      <template v-if="current !== null">
        <img
          :src="`${photos[current]}?w=1600`"
          :alt="`Foto ${current + 1} di ${photos.length} · ${title}`"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        />
        <p class="counter">{{ current + 1 }} / {{ photos.length }}</p>
        <button type="button" class="lb-btn lb-close" aria-label="Chiudi" @click="close">
          <AppIcon name="close" :size="24" />
        </button>
        <button type="button" class="lb-btn lb-prev" aria-label="Foto precedente" @click="step(-1)">
          <AppIcon name="chevron-left" :size="28" />
        </button>
        <button type="button" class="lb-btn lb-next" aria-label="Foto successiva" @click="step(1)">
          <AppIcon name="chevron-right" :size="28" />
        </button>
        <a class="lb-btn lb-download" :href="photos[current]" download aria-label="Scarica la foto">
          <AppIcon name="download" :size="22" />
        </a>
      </template>
    </dialog>
  </div>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}
.photos {
  list-style: none;
  padding: 0;
  margin: 0;
  columns: 3 260px;
  column-gap: 0.75rem;
}
.photos li {
  break-inside: avoid;
  margin-bottom: 0.75rem;
}
.thumb {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: zoom-in;
  background: var(--surface-2);
}
.thumb img {
  width: 100%;
  height: auto;
  transition:
    transform 0.4s ease,
    filter 0.4s ease;
}
.thumb:hover img {
  transform: scale(1.03);
  filter: brightness(1.05);
}
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgb(0 13 19 / 0.96);
  color: #fff;
}
.lightbox[open] {
  display: grid;
  place-items: center;
}
.lightbox::backdrop {
  background: rgb(0 0 0 / 0.6);
}
.lightbox img {
  max-width: calc(100vw - 2rem);
  max-height: calc(100dvh - 6rem);
  object-fit: contain;
  user-select: none;
}
.counter {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 0.9rem;
  color: var(--on-dark-muted);
}
.lb-btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.08);
  color: #fff;
  cursor: pointer;
}
.lb-btn:hover {
  background: rgb(255 255 255 / 0.2);
  color: #fff;
}
.lb-close {
  top: 1rem;
  right: 1rem;
}
.lb-download {
  top: 1rem;
  right: 4.5rem;
}
.lb-prev {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
.lb-next {
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>
