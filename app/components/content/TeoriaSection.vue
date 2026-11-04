<script setup lang="ts">
defineProps<{ id: string; title: string; tone: 'nero' | 'marmo' }>()
</script>

<template>
  <section :id="id" class="teoria-band" :class="`teoria-band--${tone}`">
    <h2 class="teoria-label">{{ title }}</h2>
    <div class="teoria-section">
      <blockquote v-if="$slots.quote" class="teoria-quote"><slot name="quote" /></blockquote>
      <div class="teoria-prose"><slot /></div>
      <div v-if="$slots.wide" class="teoria-wide"><slot name="wide" /></div>
      <div v-if="$slots.after" class="teoria-prose"><slot name="after" /></div>
    </div>
  </section>
</template>
