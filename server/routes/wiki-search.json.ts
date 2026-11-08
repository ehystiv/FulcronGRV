import { queryCollectionSearchSections } from '@nuxt/content/server'

// Search index of the wiki, one entry per section (page or heading). Prerendered to /wiki-search.json
// and downloaded by WikiSearch the first time someone uses the search box.
export default defineEventHandler(async (event) => {
  const sections = await queryCollectionSearchSections(event, 'wiki', { ignoredTags: ['style', 'script'] })
  return sections
    .filter((section) => section.title)
    .map((section) => ({
      id: section.id,
      title: section.title,
      // Headings above this section, starting from the page title
      parents: section.titles,
      text: section.content.replace(/\s+/g, ' ').trim(),
    }))
})
