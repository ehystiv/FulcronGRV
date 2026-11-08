<script setup lang="ts">
// The page opens in the dark: the only thing to see is the lamp, and pulling its cord lights the site.
// The dark is a layer over the page, so the text stays in the document for screen readers and search
// engines, and without JavaScript the blackout never appears (see the inline script in the page).
type Phase = 'dark' | 'lighting' | 'lit'

const phase = ref<Phase>('dark')
const pulled = ref(false)
const button = ref<HTMLButtonElement>()
const blackout = ref<HTMLElement>()
const bulb = ref<SVGElement>()

function setPhase(next: Phase) {
  phase.value = next
  const root = document.documentElement
  root.classList.toggle('sd-dark', next !== 'lit')
  root.classList.toggle('sd-lighting', next === 'lighting')
}

// The light spreads from the real position of the bulb, which depends on the screen size
function aimLight() {
  if (!bulb.value || !blackout.value) return
  const { left, top, width, height } = bulb.value.getBoundingClientRect()
  blackout.value.style.setProperty('--sd-x', `${left + width / 2}px`)
  blackout.value.style.setProperty('--sd-y', `${top + height / 2}px`)
}

function pull() {
  if (phase.value === 'lighting') return
  pulled.value = true
  if (phase.value === 'lit') {
    // A switch cuts the light at once. The lamp is at the top of the page, the dark must find it there
    window.scrollTo({ top: 0, behavior: 'instant' })
    setPhase('dark')
  } else {
    aimLight()
    setPhase('lighting')
  }
}

// Whoever tabs away from the lamp is reading the page with the keyboard: it must not stay hidden
function onFocus(e: FocusEvent) {
  if (phase.value === 'dark' && e.target !== button.value) setPhase('lit')
}

function onLightSettled(e: AnimationEvent) {
  if (e.animationName.startsWith('sd-light') && phase.value === 'lighting') setPhase('lit')
}

onMounted(() => {
  // A link to a section, or a reload further down the page, starts with the lights on
  setPhase(window.scrollY === 0 && !location.hash ? 'dark' : 'lit')
  aimLight()
  window.addEventListener('resize', aimLight, { passive: true })
  document.addEventListener('focusin', onFocus)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', aimLight)
  document.removeEventListener('focusin', onFocus)
  document.documentElement.classList.remove('sd-dark', 'sd-lighting')
})
</script>

<template>
  <div class="sd-lamp">
    <button
      ref="button"
      type="button"
      class="sd-lamp__switch"
      :class="{ 'is-pulled': pulled }"
      :aria-label="phase === 'lit' ? 'Spegni la luce' : 'Accendi la luce'"
      @click="pull"
      @animationend="(e) => e.animationName === 'sd-pull' && (pulled = false)"
    >
      <svg viewBox="0 0 240 490" aria-hidden="true">
        <path class="sd-lamp__metal" d="M118 0h4v96h-4z" />
        <!-- Behind the shade and starting well inside it: the cord pays out when pulled, it never detaches -->
        <g class="sd-lamp__cord">
          <path class="sd-lamp__string" d="M170 150v304" />
          <path class="sd-lamp__metal" d="M170 452c5 0 8 4 8 9l-3 15h-10l-3-15c0-5 3-9 8-9Z" />
        </g>
        <circle ref="bulb" class="sd-lamp__bulb" cx="120" cy="208" r="27" />
        <path
          class="sd-lamp__metal"
          d="M120 92c-9 0-14 5-15 14-19 5-27 22-37 40-13 23-41 34-48 60h200c-7-26-35-37-48-60-10-18-18-35-37-40-1-9-6-14-15-14Z"
        />
        <path class="sd-lamp__metal" d="M18 206h204v6H18z" />
      </svg>
    </button>
    <p class="sd-lamp__hint" aria-hidden="true">Tira la cordicina</p>
  </div>
  <div ref="blackout" class="sd-blackout" aria-hidden="true" @animationend="onLightSettled" />
</template>
