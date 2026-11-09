<script setup lang="ts">
const visible = ref(false)
// Shown only while scrolling up: reading down, it would sit on top of the content
let lastY = 0
const onScroll = () => {
  const y = window.scrollY
  visible.value = y > 600 && y < lastY
  lastY = y
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
const toTop = () => window.scrollTo({ top: 0 })
</script>

<template>
  <Transition
    enter-from-class="translate-y-2 opacity-0"
    leave-to-class="translate-y-2 opacity-0"
    enter-active-class="transition duration-200"
    leave-active-class="transition duration-200"
  >
    <button
      v-show="visible"
      type="button"
      aria-label="Torna all’inizio della pagina"
      class="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center rounded-full border border-gold-soft/40 bg-primary text-on-dark shadow-card-lg hover:bg-primary-hover notte:shadow-luce"
      @click="toTop"
    >
      <AppIcon name="arrow-up" :size="22" />
    </button>
  </Transition>
</template>
