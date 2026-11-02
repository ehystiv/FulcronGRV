// v-accordion: animates the opening and closing of a <details> element.
// Usage: <details v-accordion> … </details>
// While it runs, `data-expanded` already reflects the final state, so icons
// can rotate in sync: class="group-data-[expanded=true]:rotate-90".
const DURATION = 280
const EASING = 'cubic-bezier(0.2, 0.7, 0.2, 1)'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLDetailsElement>('accordion', {
    getSSRProps: () => ({ 'data-expanded': 'false' }),

    mounted(el) {
      const summary = el.querySelector<HTMLElement>(':scope > summary')
      if (!summary) return
      el.dataset.expanded = String(el.open)

      let animation: Animation | null = null

      // Heights are border-box (Tailwind preflight): include padding and borders
      const frame = () => {
        const style = getComputedStyle(el)
        return ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce(
          (sum, prop) => sum + parseFloat(style[prop as keyof CSSStyleDeclaration] as string),
          0,
        )
      }
      const closedHeight = () => summary.offsetHeight + frame()

      const animate = (from: number, to: number, onDone: () => void) => {
        animation?.cancel()
        el.style.overflow = 'hidden'
        animation = el.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION, easing: EASING })
        animation.onfinish = () => {
          onDone()
          el.style.height = ''
          el.style.overflow = ''
          animation = null
        }
      }

      const open = () => {
        el.dataset.expanded = 'true'
        const from = el.offsetHeight
        el.style.height = `${from}px`
        el.open = true
        // scrollHeight covers content and padding, not the borders
        const style = getComputedStyle(el)
        const to = el.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
        el.style.height = ''
        animate(from, to, () => {})
      }

      const close = () => {
        el.dataset.expanded = 'false'
        animate(el.offsetHeight, closedHeight(), () => (el.open = false))
      }

      summary.addEventListener('click', (event) => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
          // Native behaviour, just keep the attribute in sync
          requestAnimationFrame(() => (el.dataset.expanded = String(el.open)))
          return
        }
        event.preventDefault()
        if (el.dataset.expanded === 'true') close()
        else open()
      })

      // Programmatic changes (e.g. closing the menu after navigation)
      el.addEventListener('toggle', () => {
        if (!animation) el.dataset.expanded = String(el.open)
      })
    },
  })
})
