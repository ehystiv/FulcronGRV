<script setup lang="ts">
// Recursive menu of the wiki (sections are folders, open on the current page)
export interface WikiNavItem {
  title: string
  path: string
  order?: number
  /** false for folders without an index page */
  page?: boolean
  children?: WikiNavItem[]
}

defineProps<{ items: WikiNavItem[]; level?: number }>()
const route = useRoute()
// Folders without a page are always open; sections open on the current page
const isOpen = (item: WikiNavItem) =>
  item.page === false || route.path === item.path || route.path.startsWith(`${item.path}/`)
</script>

<template>
  <ul :class="level ? 'ml-3 border-l border-line pl-2' : ''">
    <li v-for="item in items" :key="item.path">
      <span v-if="item.page === false" class="block px-2.5 py-1.5 text-[0.92rem] font-semibold text-ink">
        {{ item.title }}
      </span>
      <NuxtLink
        v-else
        :to="item.path"
        class="block rounded-md px-2.5 py-1.5 text-[0.92rem] leading-snug text-muted no-underline hover:bg-surface-2 hover:text-ink"
        exact-active-class="!bg-ink !text-on-dark"
      >
        {{ item.title }}
      </NuxtLink>
      <WikiNav v-if="item.children?.length && isOpen(item)" :items="item.children" :level="(level ?? 0) + 1" />
    </li>
  </ul>
</template>
