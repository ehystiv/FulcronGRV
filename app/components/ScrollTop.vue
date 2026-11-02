<script setup lang="ts">
const visible = ref(false)
function onScroll() {
  visible.value = window.scrollY > 600
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <Transition name="fade">
    <button v-show="visible" class="scroll-top" type="button" aria-label="Torna all’inizio della pagina" @click="toTop">
      <AppIcon name="arrow-up" :size="22" />
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 40;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgb(217 191 127 / 0.4);
  border-radius: 50%;
  background: var(--ink);
  color: var(--on-dark);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
}
.scroll-top:hover {
  background: var(--teal);
}
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
