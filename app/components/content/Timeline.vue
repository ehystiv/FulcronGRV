<script setup lang="ts">
defineProps<{ eras: { name: string; events: { date: string; event: string }[] }[] }>()
</script>

<template>
  <div class="not-prose">
    <div v-for="era in eras" :key="era.name">
      <h3 class="mt-6 mb-4 text-2xl text-forest">{{ era.name }}</h3>
      <ol class="mb-4 border-l-2 border-line pl-6">
        <li
          v-for="(e, i) in era.events"
          :key="i"
          v-reveal
          class="relative pb-5 before:absolute before:top-[0.4em] before:-left-[calc(1.5rem+7px)] before:size-3 before:rounded-full before:border-2 before:border-gold before:bg-parchment"
        >
          <span class="block text-[0.85rem] font-semibold tracking-wide text-teal">{{ e.date }}</span>
          <p class="mt-0.5">{{ e.event }}</p>
        </li>
      </ol>
    </div>
  </div>
</template>
