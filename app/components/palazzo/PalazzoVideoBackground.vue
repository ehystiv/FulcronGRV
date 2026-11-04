<script setup lang="ts">
// Full-screen trailer fixed behind the page, with pause and audio controls
// (moving content must be pausable; the original trailer had sound).
const video = ref<HTMLVideoElement>()
const playing = ref(true)
const muted = ref(true)

// The trailer (1.7 MB) is not downloaded up front: it starts on its own only on wide screens,
// without reduced motion or data saving. On phones the poster stays and the play button loads it.
onMounted(() => {
  const el = video.value
  if (!el) return
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const autoplay =
    !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(min-width: 768px)').matches && !saveData
  if (autoplay) el.play().catch(() => (playing.value = false))
  else playing.value = false
})

function togglePlay() {
  const el = video.value
  if (!el) return
  if (el.paused)
    el.play()
      .then(() => (playing.value = true))
      .catch(() => {})
  else {
    el.pause()
    playing.value = false
  }
}

function toggleAudio() {
  const el = video.value
  if (!el) return
  el.muted = !el.muted
  el.volume = 0.3
  muted.value = el.muted
  if (!el.muted && el.paused) togglePlay()
}

const buttonClass =
  'grid size-11 place-items-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition hover:border-gold-soft hover:text-gold-soft'
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
    <video
      ref="video"
      class="size-full object-cover"
      src="/oneshot/palazzo-destini/video.mp4"
      poster="/oneshot/palazzo-destini/video-poster.jpg"
      muted
      loop
      playsinline
      preload="none"
    />
  </div>

  <div
    class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 flex gap-2"
  >
    <button
      type="button"
      :class="buttonClass"
      :aria-label="playing ? 'Metti in pausa il video' : 'Riproduci il video'"
      @click="togglePlay"
    >
      <AppIcon :name="playing ? 'pause' : 'play'" :size="20" />
    </button>
    <button
      type="button"
      :class="buttonClass"
      :aria-label="muted ? 'Attiva l’audio del video' : 'Disattiva l’audio del video'"
      @click="toggleAudio"
    >
      <AppIcon :name="muted ? 'mute' : 'volume'" :size="20" />
    </button>
  </div>
</template>
