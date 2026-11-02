import type { WikiNavItem } from '~/components/wiki/WikiNav.vue'

/** Menu tree of the wiki, sorted by `order` and then by title. */
export function useWikiNavigation() {
  return useAsyncData(
    'wiki-navigation',
    async () => {
      const tree = (await queryCollectionNavigation('wiki', ['order'])) as WikiNavItem[]
      const sort = (items: WikiNavItem[], parent?: string): WikiNavItem[] =>
        items
          // A folder's index page is also listed among its children: skip the duplicate
          .filter((item) => item.path !== parent)
          .map((item) => {
            const children = item.children && sort(item.children, item.path)
            return { ...item, children: children?.length ? children : undefined }
          })
          .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title, 'it'))
      // The root node is the wiki home (/wiki): its children are the sections
      const root = tree.find((item) => item.path === '/wiki')
      return sort(root?.children ?? tree).filter((item) => item.path !== '/wiki')
    },
    { default: () => [] },
  )
}
