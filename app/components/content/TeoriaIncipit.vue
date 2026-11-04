<script setup lang="ts">
defineProps<{ year: string }>()
</script>

<template>
  <section class="teoria-band teoria-band--marmo teoria-incipit">
    <p class="teoria-incipit__year">{{ year }}</p>
    <div class="teoria-incipit__text"><slot /></div>
    <div class="teoria-incipit__credits"><slot name="credits" /></div>
  </section>
</template>
