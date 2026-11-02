/**
 * Loads a page from content/pagine/<slug>.md and sets its title and description.
 * A missing file is a 404.
 */
export async function usePage(slug: string) {
  const request = useAsyncData(`pagina-${slug}`, () => queryCollection('pagine').path(`/pagine/${slug}`).first())

  // Composables must run before the first `await`, so the values are reactive getters
  const data = request.data
  useSeoMeta({
    title: () => data.value?.title,
    description: () => data.value?.description,
    ogTitle: () => data.value?.title,
    ogDescription: () => data.value?.description,
    ogImage: () => data.value?.image,
  })

  const { data: page } = await request
  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata', fatal: true })
  }
  return page as Ref<NonNullable<typeof page.value>>
}
