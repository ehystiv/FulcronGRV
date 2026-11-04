<script setup lang="ts">
defineProps<{ word: string }>()
</script>

<template>
  <div class="teoria-safeword">
    <h3>{{ word }}</h3>
    <slot />
  </div>
</template>
