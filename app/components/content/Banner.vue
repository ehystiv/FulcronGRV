<script setup lang="ts">
// Full-width photo with a title, used inside Markdown pages:
// ::banner{src="/immagini/x.jpg" alt="…" eyebrow="…" title="…" align="right"}
withDefaults(
  defineProps<{
    src: string
    alt?: string
    eyebrow?: string
    title: string
    align?: 'left' | 'right'
    first?: boolean
  }>(),
  { alt: '', align: 'left' },
)
</script>

<template>
  <section
    class="not-prose full-bleed on-dark relative isolate my-12 h-[clamp(260px,45vw,480px)] overflow-hidden text-white first:mt-0"
  >
    <SiteImage
      :src="src"
      :alt="alt"
      :loading="first ? 'eager' : 'lazy'"
      class="absolute inset-0 -z-20 size-full object-cover"
    />
    <div class="absolute inset-0 -z-10 bg-linear-to-b from-ink-deep/15 from-30% to-ink-deep/85" />
    <div
      class="container-site flex h-full flex-col justify-end pb-[clamp(1.5rem,4vw,3rem)]"
      :class="align === 'right' && 'items-end text-right'"
    >
      <span v-if="eyebrow" class="eyebrow text-gold-soft [text-shadow:0_0_3px_rgb(0_26_38/0.95),0_1px_12px_rgb(0_26_38/0.8)]">{{ eyebrow }}</span>
      <component
        :is="first ? 'h1' : 'h2'"
        class="m-0 text-[clamp(2.2rem,5vw,3.6rem)] text-white [text-shadow:0_2px_20px_rgb(0_0_0/0.5)]"
      >
        {{ title }}
      </component>
    </div>
  </section>
</template>
