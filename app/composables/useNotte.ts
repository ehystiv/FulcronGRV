// Night mode: with the phone or computer set to dark, the site switches to the night colours of main.css.
// The pages of a single oneshot keep their own look, day and night.
export function useNotte() {
  const route = useRoute()
  useHead(() => ({ htmlAttrs: { class: /^\/oneshot\/./.test(route.path) ? '' : 'notte' } }))
}
