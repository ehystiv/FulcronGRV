<script setup lang="ts">
defineProps<{ name: string; tone: 'azzurro' | 'rosso' | 'bianco' | 'grigio' }>()
</script>

<template>
  <article class="teoria-casta">
    <div class="teoria-casta__card" :class="`teoria-casta__card--${tone}`">
      <TeoriaSigil :name="name" />
      <h3>{{ name }}</h3>
    </div>
    <div class="teoria-casta__text"><slot /></div>
  </article>
</template>
