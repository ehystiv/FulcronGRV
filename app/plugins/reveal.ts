// v-reveal: fades elements in when they scroll into view.
// Usage: <div v-reveal> or <div v-reveal="150"> (delay in ms).
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  function getObserver() {
    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    // Rendered on the server too, so the element is hidden before hydration (no flash)
    getSSRProps: (binding) => ({
      'data-reveal': '',
      style: binding.value ? `--reveal-delay:${binding.value}ms` : undefined,
    }),
    mounted(el, binding) {
      el.dataset.reveal = ''
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-visible')
        return
      }
      getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  })
})
