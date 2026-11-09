// Marks the page as ready for night mode: with the phone or computer set to dark, it switches to the night colours
// of main.css. Only the pages that call it change, so the rest of the site can follow one page at a time.
export function useNotte() {
  useHead({ htmlAttrs: { class: 'notte' } })
}
