// The visitor's choice between day, night and automatic (follow the phone or computer), from the footer
export type Tema = 'auto' | 'giorno' | 'notte'

export function useTema() {
  const tema = useState<Tema>('tema', () => 'auto')

  // The generated page cannot know it: read it once the page is open
  onMounted(() => {
    const scelto = document.documentElement.getAttribute('data-tema')
    tema.value = scelto === 'giorno' || scelto === 'notte' ? scelto : 'auto'
  })

  const scegli = (nuovo: Tema) => {
    tema.value = nuovo
    const radice = document.documentElement
    if (nuovo === 'auto') radice.removeAttribute('data-tema')
    else radice.setAttribute('data-tema', nuovo)
    try {
      if (nuovo === 'auto') localStorage.removeItem(CHIAVE_TEMA)
      else localStorage.setItem(CHIAVE_TEMA, nuovo)
    } catch {
      // Storage blocked: the choice lasts until the page is closed
    }
  }

  return { tema, scegli }
}
