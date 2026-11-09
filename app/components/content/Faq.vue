<script setup lang="ts">
defineProps<{ items: { q: string; a: string }[] }>()
</script>

<template>
  <div class="not-prose mx-auto mt-6 grid max-w-3xl gap-3">
    <details
      v-for="item in items"
      :key="item.q"
      v-accordion
      class="group rounded-lg border border-line bg-surface transition-colors duration-300 data-[expanded=true]:border-gold"
    >
      <summary
        class="relative cursor-pointer py-4 pr-12 pl-5 font-semibold text-ink"
      >
        {{ item.q }}
        <span
          class="absolute top-1/2 right-5 size-2.5 -translate-y-[70%] rotate-45 border-r-2 border-b-2 border-gold transition-transform duration-300 group-data-[expanded=true]:-translate-y-[30%] group-data-[expanded=true]:-rotate-135"
          aria-hidden="true"
        />
      </summary>
      <p class="max-w-[39rem] px-5 pb-4"><TestoTermini :testo="item.a" /></p>
    </details>
  </div>
</template>
