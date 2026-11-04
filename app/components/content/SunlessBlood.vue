<!-- The snow turns red: the first line of the Markdown block is the title slot, the question comes after #default -->
<script setup lang="ts">
const slots = useSlots()
</script>

<template>
  <section class="sunless-blood">
    <div class="sunless-blood__line"><slot name="title" /></div>
    <div v-if="slots.default" class="sunless-blood__question"><slot /></div>
  </section>
</template>
