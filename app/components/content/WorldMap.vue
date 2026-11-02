<script setup lang="ts">
// Map of Fulcron with a full-screen viewer: ::world-map
// In the viewer the map opens fitted to the screen; a tap switches to full size, scrollable.
const SRC = '/mappa-fulcron.jpg'
const ALT = 'Mappa di Fulcron: l’Anello di terre attorno al Mare Interno, diviso tra Nord, Est, Sud e Ovest'

const dialog = ref<HTMLDialogElement>()
const zoomed = ref(false)

function open() {
  zoomed.value = false
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}
</script>

<template>
  <figure class="not-prose mx-auto my-8 max-w-xl">
    <button
      type="button"
      class="group relative block w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-line focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
      aria-haspopup="dialog"
      @click="open"
    >
      <SiteImage
        :src="SRC"
        :alt="ALT"
        width="1280"
        height="1280"
        sizes="sm:100vw md:576px"
        class="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <span
        class="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-ink-deep/85 px-4 py-2 text-sm font-semibold text-on-dark backdrop-blur-sm"
      >
        <AppIcon name="expand" :size="16" />
        Apri la mappa
      </span>
    </button>
    <figcaption class="mt-2 text-center text-sm text-muted">La mappa dell’Anello. Toccala per ingrandirla.</figcaption>
  </figure>

  <dialog
    ref="dialog"
    class="not-prose m-0 size-full max-h-none max-w-none bg-ink-deep/95 p-0 backdrop:bg-black/70"
    aria-label="Mappa di Fulcron"
    @click.self="close"
  >
    <div class="flex size-full overflow-auto" @click.self="close">
      <img
        :src="SRC"
        :alt="ALT"
        width="1280"
        height="1280"
        class="m-auto max-w-none"
        :class="zoomed ? 'w-[1280px] cursor-zoom-out' : 'max-h-full w-auto max-w-full cursor-zoom-in object-contain'"
        @click="zoomed = !zoomed"
      />
    </div>
    <button
      type="button"
      class="fixed top-4 right-4 grid size-11 place-items-center rounded-full bg-ink-deep/85 text-on-dark ring-1 ring-white/20 hover:bg-ink"
      aria-label="Chiudi la mappa"
      @click="close"
    >
      <AppIcon name="close" :size="20" />
    </button>
  </dialog>
</template>
