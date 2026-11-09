<script setup lang="ts">
// Recursive menu of the wiki. Sections (top level) are headings with a small diamond; each folder can be opened and
// closed with its arrow, and the one holding the current page starts open. The current page is marked by an accent
// bar, and the sections on the way to it stay highlighted.
export interface WikiNavItem {
  title: string
  path: string
  order?: number
  /** false for folders without an index page */
  page?: boolean
  children?: WikiNavItem[]
}

const props = defineProps<{ items: WikiNavItem[]; level?: number }>()
const route = useRoute()
const livello = computed(() => props.level ?? 0)

const contiene = (item: WikiNavItem) => route.path === item.path || route.path.startsWith(`${item.path}/`)
// Folders opened or closed by hand, shared by the phone and desktop menus and kept while moving between pages
const scelti = useState<Record<string, boolean>>('wiki-nav-aperti', () => ({}))
const aperto = (item: WikiNavItem) => item.page === false || (scelti.value[item.path] ?? contiene(item))
const apriChiudi = (item: WikiNavItem) => {
  scelti.value = { ...scelti.value, [item.path]: !aperto(item) }
}
// Moving to another page opens the folders on its way
watch(
  () => route.path,
  () => {
    scelti.value = Object.fromEntries(
      Object.entries(scelti.value).filter(([path]) => route.path !== path && !route.path.startsWith(`${path}/`)),
    )
  },
)

// The current page: an accent bar on the left, glowing at night
const attiva =
  '!text-ink !bg-surface-2 before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-gold notte:before:shadow-luce'
</script>

<template>
  <ul :class="livello ? 'mt-0.5 mb-1.5 ml-[1.05rem] border-l border-line pl-2' : 'space-y-0.5'">
    <li
      v-for="item in items"
      :key="item.path"
      :class="!livello && 'border-t border-line/70 pt-0.5 first:border-t-0 first:pt-0'"
    >
      <div class="flex items-center gap-1">
        <span v-if="item.page === false" class="flex-1 px-2.5 py-1.5 text-[0.92rem] font-semibold text-ink max-lg:py-3">
          {{ item.title }}
        </span>
        <NuxtLink
          v-else
          :to="item.path"
          class="relative flex flex-1 items-center gap-2.5 rounded-md px-2.5 leading-snug no-underline transition-colors hover:bg-surface-2 hover:text-ink max-lg:py-3"
          :class="[
            livello ? 'py-1.5 text-[0.92rem]' : 'py-2 font-heading text-[1.02rem]',
            contiene(item) ? 'text-ink' : livello ? 'text-muted' : 'text-body',
          ]"
          :exact-active-class="attiva"
        >
          <span
            v-if="!livello"
            class="size-1.5 shrink-0 rotate-45 bg-gold notte:shadow-luce"
            :class="contiene(item) ? 'opacity-100' : 'opacity-60'"
            aria-hidden="true"
          />
          {{ item.title }}
        </NuxtLink>
        <button
          v-if="item.children?.length && item.page !== false"
          type="button"
          class="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-ink max-lg:size-11"
          :aria-expanded="aperto(item)"
          :aria-label="`${aperto(item) ? 'Chiudi' : 'Apri'} ${item.title}`"
          @click="apriChiudi(item)"
        >
          <AppIcon
            name="chevron-right"
            :size="16"
            class="transition-transform duration-300"
            :class="aperto(item) && 'rotate-90'"
          />
        </button>
      </div>
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <WikiNav v-if="item.children?.length && aperto(item)" :items="item.children" :level="livello + 1" />
      </Transition>
    </li>
  </ul>
</template>
