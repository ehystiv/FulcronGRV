<script setup lang="ts">
const route = useRoute()
const path = computed(() => route.path.replace(/\/$/, '') || '/wiki')

const pageRequest = useAsyncData(`wiki-${path.value}`, () => queryCollection('wiki').path(path.value).first())
const surroundRequest = useAsyncData(`wiki-surround-${path.value}`, () =>
  queryCollectionItemSurroundings('wiki', path.value, { fields: ['title', 'path'] }),
)
const { data: nav } = await useWikiNavigation()
const page = pageRequest.data
useSocialMeta({
  title: () => (page.value && path.value !== '/wiki' ? `${page.value.title} · Wiki` : 'Wiki di Fulcron'),
  description: () => page.value?.description,
  // The first picture of the page, if it has one
  image: () => JSON.stringify(page.value?.body ?? '').match(/"src":"(\/[^"]+\.(?:jpe?g|png|webp))"/i)?.[1],
  modified: () => page.value?.updated,
})

await Promise.all([pageRequest, surroundRequest])
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata', fatal: true })

const surround = surroundRequest.data
const toc = computed(() => page.value?.body?.toc?.links ?? [])

// Breadcrumbs: Wiki › Geopolitica › Est › Partaros
const crumbs = computed(() => {
  const parts = path.value.split('/').filter(Boolean)
  const items = new Map<string, { title: string; page?: boolean }>()
  const collect = (list: typeof nav.value) =>
    list.forEach((i) => {
      items.set(i.path, i)
      if (i.children) collect(i.children)
    })
  collect(nav.value)
  return parts.slice(1, -1).map((_, i) => {
    const p = '/' + parts.slice(0, i + 2).join('/')
    const item = items.get(p)
    // Folders without their own page are shown as plain text
    return { path: item && item.page !== false ? p : null, title: item?.title ?? parts[i + 1] }
  })
})

const updated = computed(() => formatDate(page.value?.updated))

// Close the phone menu after moving to another page
const mobileMenu = ref<HTMLDetailsElement>()
watch(path, () => {
  if (mobileMenu.value) mobileMenu.value.open = false
})
</script>

<template>
  <div v-if="page">
    <header class="border-b border-line bg-page-header">
      <div class="container-site flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Percorso" class="text-sm">
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <li>
              <NuxtLink to="/wiki" class="font-semibold tracking-wide text-gold-ink no-underline"
                >Wiki di Fulcron</NuxtLink
              >
            </li>
            <li v-for="c in crumbs" :key="c.title" class="flex items-center gap-2">
              <span aria-hidden="true">›</span>
              <NuxtLink v-if="c.path" :to="c.path" class="text-muted no-underline hover:text-ink">{{
                c.title
              }}</NuxtLink>
              <span v-else>{{ c.title }}</span>
            </li>
          </ol>
        </nav>
        <WikiSearch />
      </div>
    </header>

    <div class="container-site grid gap-10 py-[clamp(2rem,6vw,4rem)] lg:grid-cols-[250px_minmax(0,1fr)]">
      <!-- Wiki menu: sidebar on desktop, collapsible on phones -->
      <details ref="mobileMenu" v-accordion class="group rounded-card border border-line bg-surface lg:hidden">
        <summary class="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold text-ink">
          Esplora la wiki
          <AppIcon
            name="chevron-right"
            :size="18"
            class="transition-transform duration-300 group-data-[expanded=true]:rotate-90"
          />
        </summary>
        <WikiMenu :items="nav" class="px-2 pb-3" />
      </details>
      <WikiMenu
        :items="nav"
        class="sticky top-[calc(var(--spacing-header)+1.5rem)] hidden max-h-[calc(100vh-var(--spacing-header)-3rem)] self-start overflow-y-auto lg:block"
      />

      <article class="min-w-0">
        <h1 class="mb-2 text-[clamp(2rem,4.5vw,3.2rem)]">{{ page.title }}</h1>
        <!-- A notch below text-lead: the article column is narrower than on the other pages -->
        <p v-if="page.description" class="text-[clamp(1.05rem,2vw,1.2rem)] text-muted">{{ page.description }}</p>

        <details
          v-if="toc.length > 2"
          v-accordion
          class="group my-6 max-w-reading rounded-lg border border-line bg-surface px-4 py-3"
        >
          <summary class="flex cursor-pointer items-center justify-between font-semibold text-ink">
            In questa pagina
            <AppIcon
              name="chevron-right"
              :size="18"
              class="transition-transform duration-300 group-data-[expanded=true]:rotate-90"
            />
          </summary>
          <ol class="mt-2 space-y-1 text-[0.95rem]">
            <li v-for="link in toc" :key="link.id">
              <a :href="`#${link.id}`" class="no-underline">{{ link.text }}</a>
              <ol v-if="link.children?.length" class="mt-1 ml-4 space-y-1">
                <li v-for="child in link.children" :key="child.id">
                  <a :href="`#${child.id}`" class="text-muted no-underline hover:text-ink">{{ child.text }}</a>
                </li>
              </ol>
            </li>
          </ol>
        </details>

        <ContentRenderer :value="page" class="prose-fulcron max-w-reading [&_img]:rounded-card [&_img]:shadow-card" />

        <p v-if="updated" class="mt-10 text-sm text-muted">Ultima modifica: {{ updated }}</p>

        <nav
          v-if="surround?.[0] || surround?.[1]"
          class="mt-8 grid max-w-reading gap-3 border-t border-line pt-6 sm:grid-cols-2"
          aria-label="Pagine vicine"
        >
          <NuxtLink
            v-if="surround?.[0]"
            :to="surround[0].path"
            class="rounded-lg border border-line bg-surface px-4 py-3 no-underline hover:border-gold"
          >
            <span class="block text-xs font-semibold tracking-wider text-muted uppercase">Precedente</span>
            <span class="text-ink">{{ surround[0].title }}</span>
          </NuxtLink>
          <NuxtLink
            v-if="surround?.[1]"
            :to="surround[1].path"
            class="rounded-lg border border-line bg-surface px-4 py-3 text-right no-underline hover:border-gold sm:col-start-2"
          >
            <span class="block text-xs font-semibold tracking-wider text-muted uppercase">Successiva</span>
            <span class="text-ink">{{ surround[1].title }}</span>
          </NuxtLink>
        </nav>
      </article>
    </div>
  </div>
</template>
