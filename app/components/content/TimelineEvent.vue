<script setup lang="ts">
// One event of a ::timeline-era. Cards alternate left/right on wide screens;
// right-hand cards move up so the two columns interleave instead of leaving gaps.
defineProps<{ date: string }>()
</script>

<template>
  <li
    v-reveal
    class="group relative pb-7 pl-8 md:w-1/2 md:pl-0 md:odd:pr-10 md:even:ml-auto md:even:-mt-20 md:even:pl-10"
  >
    <span
      class="absolute top-4 left-0 size-4 rounded-full border-2 border-gold bg-parchment md:left-auto md:group-odd:-right-2 md:group-even:-left-2"
      aria-hidden="true"
    />
    <div
      class="rounded-lg border border-line bg-surface px-4 py-3 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold"
    >
      <p class="text-sm font-semibold tracking-wide text-teal">{{ date }}</p>
      <div class="mt-1 [&_a]:underline [&_p]:m-0 [&_strong]:text-ink">
        <slot mdc-unwrap="p" />
      </div>
    </div>
  </li>
</template>
