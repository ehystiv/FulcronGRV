<script setup lang="ts">
// ::glossario — every word of the game with its meaning, from app/utils/glossario.ts
</script>

<template>
  <dl class="not-prose mx-auto mt-6 grid max-w-3xl gap-x-8 gap-y-5 sm:grid-cols-2">
    <div
      v-for="voce in GLOSSARIO"
      :id="`termine-${voce.id}`"
      :key="voce.id"
      class="scroll-mt-[calc(var(--spacing-header)+2rem)] border-l-2 border-gold pl-4"
    >
      <dt class="font-heading text-[1.15rem] text-ink">{{ voce.nome }}</dt>
      <dd class="mt-1 text-[0.98rem] text-muted">{{ voce.definizione }}</dd>
    </div>
  </dl>
</template>
