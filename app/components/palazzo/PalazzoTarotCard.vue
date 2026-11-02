<script setup lang="ts">
// A tarot card that flips on click (front: illustration, back: character teaser)
const props = defineProps<{ front: string; back: string; name: string }>()
const flipped = ref(false)

// One shared sound for all the cards, created on the first click
let sound: HTMLAudioElement | null = null
function flip() {
  flipped.value = !flipped.value
  sound ??= Object.assign(new Audio('/oneshot/palazzo-destini/carta.mp3'), { volume: 0.3 })
  sound.currentTime = 0
  sound.play().catch(() => {})
}
</script>

<template>
  <button
    type="button"
    class="group block w-full transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:hover:translate-y-0 rounded-xl [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-soft"
    :aria-pressed="flipped"
    :aria-label="flipped ? `${props.name}: gira la carta` : `Scopri ${props.name}`"
    @click="flip"
  >
    <span
      class="relative block aspect-9/16 transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:duration-0"
      :class="flipped && '[transform:rotateY(180deg)]'"
    >
      <span
        class="absolute inset-0 overflow-hidden rounded-xl brightness-90 transition duration-500 [backface-visibility:hidden] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-gold-soft/30 group-hover:shadow-[0_0_2rem_-0.25rem_var(--color-gold-soft)] group-hover:ring-gold-soft/80 group-hover:brightness-110"
      >
        <SiteImage
          :src="front"
          :alt="`Carta di ${name}`"
          sizes="sm:50vw md:33vw lg:360px"
          class="size-full object-cover"
        />
      </span>
      <span
        class="absolute inset-0 overflow-hidden rounded-xl transition duration-500 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-gold-soft/30 group-hover:shadow-[0_0_2rem_-0.25rem_var(--color-gold-soft)] group-hover:ring-gold-soft/80"
      >
        <SiteImage
          :src="back"
          :alt="`Teaser di ${name}`"
          sizes="sm:50vw md:33vw lg:360px"
          class="size-full object-cover"
        />
      </span>
    </span>
  </button>
</template>
