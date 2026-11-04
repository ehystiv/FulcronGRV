<script setup lang="ts">
// The mark of the Great Eye, traced from the poster. The pupil watches the visitor's pointer
const pupil = ref<SVGCircleElement>()
const ring = ref<SVGCircleElement>()

// How far the pupil can travel inside the ring, in SVG units
const REACH = 11

function look(e: PointerEvent) {
  if (!pupil.value || !ring.value) return
  const { left, top, width, height } = ring.value.getBoundingClientRect()
  const dx = e.clientX - (left + width / 2)
  const dy = e.clientY - (top + height / 2)
  const distance = Math.hypot(dx, dy) || 1
  const pull = Math.min(1, distance / 240) * REACH
  pupil.value.style.transform = `translate(${(dx / distance) * pull}px, ${(dy / distance) * pull}px)`
}

onMounted(() => {
  if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('pointermove', look, { passive: true })
  }
})

onBeforeUnmount(() => window.removeEventListener('pointermove', look))
</script>

<template>
  <svg viewBox="0 0 400 400" aria-hidden="true" fill="none" stroke="currentColor">
    <g stroke-width="8">
      <path d="M137 4 294 288" />
      <path d="M164 90 4 378" />
      <path d="M62 304h318" />
    </g>
    <circle ref="ring" cx="179" cy="222" r="33" stroke-width="7" />
    <circle ref="pupil" class="teoria-pupil" cx="179" cy="222" r="11" fill="currentColor" stroke="none" />
  </svg>
</template>
