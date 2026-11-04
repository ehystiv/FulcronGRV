<script setup lang="ts">
// A period of a timeline. In Markdown:
//
// ::timeline-era{name="Quinta Era"}
// :::timeline-event{date="2000"}
// What happened, with **formatting** and [links](/wiki/...).
// :::
// ::
// Add level="2" when the timeline is not inside a ## section (e.g. wiki/storia.md).
const props = defineProps<{ name: string; level?: string | number }>()
const tag = computed(() => (String(props.level) === '2' ? 'h2' : 'h3'))
</script>

<template>
  <section class="not-prose relative my-10 first:mt-4">
    <component
      :is="tag"
      class="relative z-10 mb-8 w-fit rounded-full border border-gold bg-ink px-5 py-2 font-display text-lg tracking-wide text-gold-soft md:mx-auto md:text-xl"
    >
      {{ name }}
    </component>
    <!-- Vertical axis: on the left on phones, in the middle on wider screens -->
    <ol
      class="relative before:absolute before:inset-y-0 before:left-[7px] before:w-0.5 before:bg-line md:before:left-1/2 md:before:-translate-x-1/2"
    >
      <slot />
    </ol>
  </section>
</template>
