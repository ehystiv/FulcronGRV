<script setup lang="ts">
defineProps<{ year: string; note?: string }>()
</script>

<template>
  <div class="teoria-era">
    <p class="teoria-era__year">
      {{ year }}<small v-if="note">{{ note }}</small>
    </p>
    <div><slot /></div>
  </div>
</template>
