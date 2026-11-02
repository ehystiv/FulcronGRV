<script setup lang="ts">
// Expandable section of the Palazzo pages, in the style of the original site:
// ::palazzo-section{title="…"}
// #incipit
// Always visible introduction (optional)
// #default
// Text shown with "Espandi"
// ::
withDefaults(defineProps<{ title: string; align?: 'center' | 'left' }>(), { align: 'center' })
</script>

<template>
  <section
    class="not-prose my-14 bg-[linear-gradient(90deg,transparent,#fff_6%,#fff_94%,transparent)] py-6 text-ink-deep md:bg-[linear-gradient(90deg,transparent,#fff_30%,#fff_70%,transparent)]"
  >
    <div class="container-site flex flex-col items-center text-center">
      <h2 v-reveal class="font-cardinal text-[clamp(2.2rem,5vw,3.4rem)] font-normal tracking-normal text-ink-deep">
        {{ title }}
      </h2>
      <div class="my-3 h-px w-2/3 max-w-xl bg-ink-deep" aria-hidden="true" />
      <div v-if="$slots.incipit" class="mb-3 max-w-2xl italic [&_p]:mb-2">
        <slot name="incipit" />
      </div>
      <details v-accordion class="group w-full">
        <summary
          class="mx-auto mb-3 w-fit cursor-pointer list-none rounded-md border border-ink-deep/40 px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink-deep hover:text-white [&::-webkit-details-marker]:hidden"
        >
          <span class="group-data-[expanded=true]:hidden">Espandi</span>
          <span class="hidden group-data-[expanded=true]:inline">Chiudi</span>
        </summary>
        <div
          class="mx-auto max-w-3xl pb-2 [&_li]:mb-3 [&_li]:border-b [&_li]:border-ink-deep/40 [&_li]:pb-2 [&_p]:mb-3 [&_ul]:list-none [&_ul]:p-0"
          :class="align === 'left' ? 'text-left' : 'text-center'"
        >
          <slot />
        </div>
      </details>
    </div>
  </section>
</template>
