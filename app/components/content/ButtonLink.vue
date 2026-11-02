<script setup lang="ts">
// :button-link[Testo]{href="https://…"} or {to="/pagina"}
defineProps<{ href?: string; to?: string; variant?: 'primary' | 'gold' | 'outline' }>()
</script>

<template>
  <span class="not-prose my-4 inline-flex">
    <UiButton :href="href" :to="to" :variant="variant ?? 'primary'" :icon-right="href ? 'external' : 'arrow-right'">
      <slot mdc-unwrap="p" />
    </UiButton>
  </span>
</template>
