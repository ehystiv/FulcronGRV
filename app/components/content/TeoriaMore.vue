<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <details v-accordion class="teoria-more">
    <summary>
      {{ label }}
      <span class="teoria-more__sign" aria-hidden="true" />
    </summary>
    <div class="teoria-more__body"><slot /></div>
  </details>
</template>
