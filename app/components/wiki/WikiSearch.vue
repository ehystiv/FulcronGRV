<script setup lang="ts">
// Search box of the wiki. The index (/wiki-search.json, one entry per section) is downloaded the first time
// the box gets focus. Every word typed must appear; matches in titles rank above matches in the text.
// Accents and case are ignored, so "nobilta" finds "Nobiltà".
type Section = { id: string; title: string; parents: string[]; text: string }
type Result = Section & { page: string; snippet: { before: string; match: string; after: string } }

const MAX_RESULTS = 8
const query = ref('')
const open = ref(false)
const active = ref(0)
const sections = ref<(Section & { haystack: string; titleKey: string })[] | null>(null)
const failed = ref(false)
const input = ref<HTMLInputElement>()
const root = ref<HTMLElement>()
const uid = useId()

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

let loading: Promise<void> | undefined
function load() {
  loading ??= $fetch<Section[]>('/wiki-search.json')
    .then((list) => {
      sections.value = list.map((s) => ({
        ...s,
        titleKey: normalize([s.title, ...s.parents].join(' ')),
        haystack: normalize([s.title, ...s.parents, s.text].join(' ')),
      }))
    })
    .catch(() => {
      failed.value = true
      loading = undefined
    })
  return loading
}

/** A short piece of text around the first word found, split so the match can be highlighted. */
function snippet(text: string, word: string) {
  const at = normalize(text).indexOf(word)
  if (at < 0) return { before: text.slice(0, 110) + (text.length > 110 ? '…' : ''), match: '', after: '' }
  const start = Math.max(0, at - 40)
  const end = Math.min(text.length, at + word.length + 70)
  return {
    before: (start > 0 ? '…' : '') + text.slice(start, at),
    match: text.slice(at, at + word.length),
    after: text.slice(at + word.length, end) + (end < text.length ? '…' : ''),
  }
}

const words = computed(() => normalize(query.value).split(/\s+/).filter(Boolean))

const results = computed<Result[]>(() => {
  if (!sections.value || !words.value.length) return []
  return sections.value
    .filter((s) => words.value.every((w) => s.haystack.includes(w)))
    .map((s) => {
      const inTitle = words.value.filter((w) => s.titleKey.includes(w)).length
      // A whole page whose title matches comes before the sections of other pages
      const score = inTitle * 10 + (words.value.length - inTitle) + (inTitle && !s.parents.length ? 5 : 0)
      return { s, score }
    })
    .sort((a, b) => b.score - a.score || a.s.title.localeCompare(b.s.title, 'it'))
    .slice(0, MAX_RESULTS)
    .map(({ s }) => {
      // Highlight the first typed word that the text contains
      const text = normalize(s.text)
      const word = words.value.find((w) => text.includes(w)) ?? words.value[0]!
      return { ...s, page: s.parents[0] ?? s.title, snippet: snippet(s.text, word) }
    })
})

const showList = computed(() => open.value && words.value.length > 0)
const status = computed(() => {
  if (!words.value.length) return ''
  if (failed.value) return 'La ricerca non è disponibile in questo momento.'
  if (!sections.value) return 'Caricamento…'
  if (!results.value.length) return 'Nessun risultato'
  return results.value.length === 1 ? '1 risultato' : `${results.value.length} risultati`
})

watch(query, () => {
  active.value = 0
  open.value = true
})

const router = useRouter()
function go(result?: Result) {
  if (!result) return
  open.value = false
  query.value = ''
  input.value?.blur()
  router.push(result.id)
}

function onKeydown(event: KeyboardEvent) {
  const count = results.value.length
  if (event.key === 'ArrowDown' && count) {
    event.preventDefault()
    open.value = true
    active.value = (active.value + 1) % count
  } else if (event.key === 'ArrowUp' && count) {
    event.preventDefault()
    active.value = (active.value - 1 + count) % count
  } else if (event.key === 'Enter' && showList.value) {
    event.preventDefault()
    go(results.value[active.value])
  } else if (event.key === 'Escape') {
    if (showList.value) open.value = false
    else query.value = ''
  }
}

// Close the list when clicking anywhere else
function onFocusOut(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node | null)) open.value = false
}
</script>

<template>
  <div ref="root" class="relative w-full sm:max-w-80" @focusout="onFocusOut">
    <label :for="`${uid}-input`" class="sr-only">Cerca nella wiki</label>
    <div class="relative">
      <AppIcon
        name="search"
        :size="17"
        class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
      />
      <input
        :id="`${uid}-input`"
        ref="input"
        v-model="query"
        type="search"
        placeholder="Cerca nella wiki"
        autocomplete="off"
        spellcheck="false"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="showList"
        :aria-controls="`${uid}-list`"
        :aria-activedescendant="showList && results.length ? `${uid}-option-${active}` : undefined"
        class="min-h-11 w-full rounded-full border border-line bg-surface py-2 pr-4 pl-9 text-[0.95rem] text-ink placeholder:text-muted focus:border-gold-ink focus:outline-none"
        @focus="(load(), (open = true))"
        @keydown="onKeydown"
      />
    </div>

    <p class="sr-only" aria-live="polite">{{ showList ? status : '' }}</p>

    <div
      v-show="showList"
      class="absolute inset-x-0 top-full z-30 mt-2 max-h-[min(28rem,70vh)] overflow-y-auto rounded-card border border-line bg-surface shadow-card-lg sm:left-auto sm:w-[min(32rem,calc(100vw-2rem))]"
    >
      <ul v-if="results.length" :id="`${uid}-list`" role="listbox" aria-label="Risultati della ricerca" class="py-1.5">
        <li
          v-for="(result, i) in results"
          :id="`${uid}-option-${i}`"
          :key="result.id"
          role="option"
          :aria-selected="i === active"
          class="cursor-pointer px-4 py-2.5"
          :class="i === active ? 'bg-surface-2' : ''"
          @mousedown.prevent="go(result)"
          @mousemove="active = i"
        >
          <span class="block text-xs font-semibold tracking-wide text-gold-ink uppercase">{{ result.page }}</span>
          <span class="block font-semibold text-ink">{{ result.title }}</span>
          <span v-if="result.text" class="mt-0.5 block text-sm text-muted">
            <span>{{ result.snippet.before }}</span>
            <mark v-if="result.snippet.match" class="rounded-sm bg-gold-soft/45 px-0.5 text-ink">{{
              result.snippet.match
            }}</mark>
            <span>{{ result.snippet.after }}</span>
          </span>
        </li>
      </ul>
      <p v-else :id="`${uid}-list`" class="m-0 px-4 py-3 text-sm text-muted">{{ status }}</p>
    </div>
  </div>
</template>
