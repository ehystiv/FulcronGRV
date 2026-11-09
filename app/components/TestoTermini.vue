<script setup lang="ts">
// Plain text (FAQ answers, steps) with the words of the glossary explained on hover or tap, the first time each appears
const props = defineProps<{ testo: string }>()
const pezzi = computed(() => dividiTermini(props.testo))
</script>

<template>
  <template v-for="(pezzo, i) in pezzi" :key="i">
    <Termine v-if="pezzo.voce" :voce="pezzo.voce">{{ pezzo.testo }}</Termine>
    <template v-else>{{ pezzo.testo }}</template>
  </template>
</template>
