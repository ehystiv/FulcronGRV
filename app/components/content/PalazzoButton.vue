<script setup lang="ts">
// Button of the Palazzo pages, in the site's style:
// :palazzo-button[Testo]{to="/…"}, {href="https://…"} or {disabled} (e.g. closed registrations)
import { NuxtLink } from '#components'

defineProps<{ to?: string; href?: string; disabled?: boolean; note?: string }>()

// 'light' inside the white cards (PalazzoSection), 'dark' over the video / stars
const surface = inject<'light' | 'dark'>('palazzo-surface', 'dark')
const disabledClass = computed(() =>
  surface === 'light'
    ? 'cursor-not-allowed border border-ink-deep/20 bg-ink-deep/5 text-ink-deep/45'
    : 'cursor-not-allowed border border-white/25 bg-white/10 text-white/60',
)
const noteClass = computed(() => (surface === 'light' ? 'text-muted' : 'text-white/80'))

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold tracking-wider uppercase no-underline transition'
</script>

<template>
  <span class="not-prose my-6 flex flex-col items-center gap-2">
    <span v-if="disabled" role="link" aria-disabled="true" :class="[base, disabledClass]">
      <slot mdc-unwrap="p" />
    </span>
    <component
      :is="to ? NuxtLink : 'a'"
      v-else
      :to="to"
      :href="href"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener' : undefined"
      :class="[base, 'bg-gold text-ink-deep hover:-translate-y-px hover:bg-gold-soft hover:text-ink-deep']"
    >
      <slot mdc-unwrap="p" />
      <AppIcon :name="href ? 'external' : 'arrow-right'" :size="16" />
    </component>
    <span v-if="disabled && note" class="text-xs font-semibold tracking-wide" :class="noteClass">{{ note }}</span>
  </span>
</template>
