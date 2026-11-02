<script setup lang="ts">
// A period of a timeline. In Markdown:
//
// ::timeline-era{name="Quinta Era"}
// :::timeline-event{date="2000"}
// What happened, with **formatting** and [links](/wiki/...).
// :::
// ::
defineProps<{ name: string }>()
</script>

<template>
  <section class="not-prose relative my-10 first:mt-4">
    <h3
      class="relative z-10 mb-8 w-fit rounded-full border border-gold bg-ink px-5 py-2 font-display text-lg tracking-wide text-gold-soft md:mx-auto md:text-xl"
    >
      {{ name }}
    </h3>
    <!-- Vertical axis: on the left on phones, in the middle on wider screens -->
    <ol
      class="relative before:absolute before:inset-y-0 before:left-[7px] before:w-0.5 before:bg-line md:before:left-1/2 md:before:-translate-x-1/2"
    >
      <slot />
    </ol>
  </section>
</template>
