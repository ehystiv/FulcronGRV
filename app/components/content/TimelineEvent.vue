<script setup lang="ts">
// One event of a ::timeline-era. Cards alternate left/right on wide screens;
// right-hand cards move up so the two columns interleave instead of leaving gaps.
// `chip` adds a small label next to the text, `major` frames the card as a milestone.
defineProps<{ date?: string; chip?: string; major?: boolean }>()
</script>

<template>
  <li
    v-reveal
    class="group relative pb-7 pl-8 md:w-1/2 md:pl-0 md:odd:pr-10 md:even:ml-auto md:even:-mt-20 md:even:pl-10"
  >
    <span
      class="absolute top-4 left-0 size-4 rounded-full border-2 border-gold md:left-auto md:group-odd:-right-2 md:group-even:-left-2"
      :class="major ? 'bg-gold' : 'bg-parchment'"
      aria-hidden="true"
    />
    <div
      class="rounded-lg px-4 py-3 shadow-card transition md:min-h-20 duration-300 hover:-translate-y-0.5"
      :class="
        major
          ? 'border-4 border-double border-gold bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-gold)_14%,transparent),transparent_60%),var(--color-surface)] hover:shadow-card-lg [&_strong]:block [&_strong]:font-heading [&_strong]:text-[1.2rem] [&_strong]:leading-snug [&_strong]:font-normal'
          : 'border border-line bg-surface hover:border-gold'
      "
    >
      <p v-if="date" class="mb-1 text-sm font-semibold tracking-wide text-teal">{{ date }}</p>
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 [&_a]:underline [&_p]:m-0 [&_strong]:text-ink">
          <slot mdc-unwrap="p" />
        </div>
        <span
          v-if="chip"
          class="mt-0.5 shrink-0 rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-forest"
        >
          {{ chip }}
        </span>
      </div>
    </div>
  </li>
</template>
