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

  // Enabled here and not in an inline script: until the app is alive, nothing is hidden.
  // Not on app:mounted: pages with async setup hydrate after it, and their visible content would dip
  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => document.documentElement.classList.add('js'))

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    // Rendered on the server too, but it only hides anything once `.js` is set below
    getSSRProps: (binding) => ({
      'data-reveal': '',
      style: binding.value ? `--reveal-delay:${binding.value}ms` : undefined,
    }),
    mounted(el, binding) {
      el.dataset.reveal = ''
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      // What the visitor can already see (or has scrolled past) before hydration ends must not vanish
      const alreadySeen = nuxtApp.isHydrating && el.getBoundingClientRect().top < window.innerHeight
      if (alreadySeen || typeof IntersectionObserver === 'undefined') {
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
