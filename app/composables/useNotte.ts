// Night mode. Every page supports it except those of a single oneshot, which keep their own look day and night:
// the supported ones carry the class `notte` on <html>. Whether it is night then depends on the visitor's choice in
// the footer (useTema), or on their phone or computer when they leave it on automatic (main.css, "Night mode").

/** Remembered in the visitor's browser only */
export const CHIAVE_TEMA = 'fulcron-tema'

export const conNotte = (path: string) => !/^\/oneshot\/./.test(path)

// Runs in <head>, before the first paint: a page never flashes in the wrong colours
const APPLICA_TEMA = `try{var t=localStorage.getItem('${CHIAVE_TEMA}');if(t==='giorno'||t==='notte')document.documentElement.setAttribute('data-tema',t)}catch(e){}`

export function useNotte() {
  const route = useRoute()
  useHead(() => ({
    htmlAttrs: { class: conNotte(route.path) ? 'notte' : '' },
    script: [{ key: 'tema', innerHTML: APPLICA_TEMA, tagPosition: 'head' }],
  }))
}
