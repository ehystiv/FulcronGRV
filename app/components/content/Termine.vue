<script setup lang="ts">
// A word of the game with its meaning on hover, focus or tap. In Markdown: :termine[PGOS] (the text is looked up in
// app/utils/glossario.ts); in Vue it also takes the entry directly.
const props = defineProps<{ voce?: VoceGlossario; t?: string }>()
const slots = useSlots()

// The slot text, for :termine[PGOS]
const testoSlot = () => {
  const testo = (nodes: unknown): string =>
    Array.isArray(nodes)
      ? nodes.map(testo).join('')
      : nodes && typeof nodes === 'object' && 'children' in nodes
        ? testo((nodes as { children: unknown }).children)
        : typeof nodes === 'string'
          ? nodes
          : ''
  return testo(slots.default?.())
}
const voce = computed(() => props.voce ?? voceGlossario(props.t ?? testoSlot()))

const id = useId()
const aperto = ref(false)
const bolla = ref<HTMLElement>()
const spostamento = ref(0)

// Mouse: opens on hover. Touch: each tap opens or closes it, a tap elsewhere closes it. Keyboard: opens on focus.
// (A tap also fires mouseenter, focus and click in a row: without telling them apart it would open and shut at once.)
const radice = ref<HTMLElement>()
let puntatore = ''
const conMouse = (e: PointerEvent, si: boolean) => {
  if (e.pointerType === 'mouse') aperto.value = si
}
const alFocus = (e: FocusEvent) => {
  if ((e.target as HTMLElement).matches(':focus-visible')) aperto.value = true
}
const alClic = () => {
  if (puntatore === 'mouse') aperto.value = true
  else aperto.value = !aperto.value
  puntatore = ''
}
const fuori = (e: PointerEvent) => {
  if (!radice.value?.contains(e.target as Node)) aperto.value = false
}
watch(aperto, (si) => {
  if (si) document.addEventListener('pointerdown', fuori)
  else document.removeEventListener('pointerdown', fuori)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', fuori))

// Keep the bubble inside the window on narrow screens
watch(aperto, async (si) => {
  spostamento.value = 0
  if (!si) return
  await nextTick()
  const r = bolla.value?.getBoundingClientRect()
  if (!r) return
  const margine = 12
  if (r.left < margine) spostamento.value = margine - r.left
  else if (r.right > window.innerWidth - margine) spostamento.value = window.innerWidth - margine - r.right
})
</script>

<template>
  <span
    v-if="voce"
    ref="radice"
    class="relative inline"
    @pointerenter="conMouse($event, true)"
    @pointerleave="conMouse($event, false)"
  >
    <button
      type="button"
      class="inline cursor-help p-0 text-inherit underline decoration-gold decoration-dotted decoration-[1.5px] underline-offset-4 [font:inherit]"
      :aria-describedby="id"
      :aria-expanded="aperto"
      @pointerdown="puntatore = $event.pointerType"
      @focus="alFocus"
      @blur="aperto = false"
      @click="alClic"
      @keydown.esc="aperto = false"
    >
      <slot>{{ t }}</slot>
    </button>
    <span
      v-show="aperto"
      :id="id"
      ref="bolla"
      role="tooltip"
      class="absolute bottom-full left-1/2 z-40 mb-2 block w-[min(18rem,calc(100vw-1.5rem))] rounded-lg border border-line bg-surface p-3 text-left text-[0.88rem] leading-snug font-normal text-body not-italic shadow-card-lg notte:shadow-luce"
      :style="{ transform: `translateX(calc(-50% + ${spostamento}px))` }"
    >
      <strong class="mb-1 block font-semibold text-ink">{{ voce.nome }}</strong>
      {{ voce.definizione }}
    </span>
  </span>
  <span v-else><slot>{{ t }}</slot></span>
</template>
