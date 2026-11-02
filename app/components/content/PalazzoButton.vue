<script setup lang="ts">
// White uppercase button of the Palazzo pages: :palazzo-button[Testo]{to="/…"} or {href="https://…"}
defineProps<{ to?: string; href?: string }>()
</script>

<template>
  <span class="not-prose my-6 flex justify-center">
    <component
      :is="to ? resolveComponent('NuxtLink') : 'a'"
      :to="to"
      :href="href"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener' : undefined"
      class="rounded-md border-2 border-ink-deep/20 bg-white px-5 py-3 text-sm font-bold tracking-wider text-ink-deep uppercase no-underline transition hover:-translate-y-px hover:bg-gold-soft hover:text-ink-deep"
    >
      <slot mdc-unwrap="p" />
    </component>
  </span>
</template>
