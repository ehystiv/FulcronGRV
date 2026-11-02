<script setup lang="ts">
// Expandable section of the Palazzo pages (white card, Cardinal title):
// ::palazzo-section{title="…"}
// #incipit
// Always visible introduction (optional)
// #default
// Text shown with "Espandi" (always visible with {:expandable="false"})
// ::
withDefaults(defineProps<{ title: string; align?: 'center' | 'left'; expandable?: boolean }>(), {
  align: 'center',
  expandable: true,
})

// Buttons inside the white card use their dark-on-light colours
provide('palazzo-surface', 'light')

const bodyClass =
  'mx-auto max-w-2xl leading-relaxed [&_li]:mb-3 [&_li]:border-b [&_li]:border-ink-deep/10 [&_li]:pb-3 [&_p]:mb-4 [&_ul]:list-none [&_ul]:p-0'
</script>

<template>
  <section class="not-prose container-site my-12 md:my-16">
    <div
      v-reveal
      class="relative mx-auto max-w-3xl rounded-2xl bg-[linear-gradient(180deg,#fff,#faf7f0)] px-6 py-9 text-ink-deep shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)] ring-1 ring-gold/35 md:px-14 md:py-12"
    >
      <h2
        class="text-center font-cardinal text-[clamp(2.2rem,5vw,3.4rem)] leading-tight font-normal tracking-normal text-ink-deep"
      >
        {{ title }}
      </h2>
      <img
        src="/oneshot/palazzo-destini/ornamento.png"
        alt=""
        width="700"
        height="400"
        class="mx-auto my-3 w-40 opacity-80"
      />
      <div
        v-if="$slots.incipit"
        class="mx-auto mb-6 max-w-2xl text-center text-[1.05rem] text-ink-deep/85 italic [&_p]:mb-2"
      >
        <slot name="incipit" />
      </div>
      <details v-if="expandable" v-accordion class="group">
        <summary
          class="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-ink-deep/25 px-5 py-2 text-sm font-semibold tracking-wide text-ink-deep transition hover:border-ink hover:bg-ink hover:text-on-dark [&::-webkit-details-marker]:hidden"
        >
          <span class="group-data-[expanded=true]:hidden">Espandi</span>
          <span class="hidden group-data-[expanded=true]:inline">Chiudi</span>
          <AppIcon
            name="chevron-down"
            :size="16"
            class="transition-transform duration-300 group-data-[expanded=true]:rotate-180"
          />
        </summary>
        <div
          class="mt-6 border-t border-gold/30 pt-6"
          :class="[bodyClass, align === 'left' ? 'text-left' : 'text-center']"
        >
          <slot />
        </div>
      </details>
      <div v-else :class="[bodyClass, align === 'left' ? 'text-left' : 'text-center']">
        <slot />
      </div>
    </div>
  </section>
</template>
