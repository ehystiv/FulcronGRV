<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="teoria-day">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>
