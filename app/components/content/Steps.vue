<script setup lang="ts">
defineProps<{ items: { title: string; text: string; to?: string; cta?: string; instagram?: boolean }[] }>()
</script>

<template>
  <ol class="not-prose mt-8 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5 p-0">
    <li
      v-for="(step, i) in items"
      :key="step.title"
      v-reveal="i * 100"
      class="relative rounded-card border border-line bg-surface px-[1.4rem] pt-9 pb-[1.4rem] shadow-card"
    >
      <span
        class="absolute -top-[1.1rem] left-[1.4rem] grid size-9 place-items-center rounded-full border-2 border-gold bg-ink font-display text-lg text-gold-soft"
        aria-hidden="true"
      >
        {{ i + 1 }}
      </span>
      <h3 class="mb-1.5 text-xl">{{ step.title }}</h3>
      <p class="text-[0.98rem] text-muted">{{ step.text }}</p>
      <NuxtLink
        v-if="step.to"
        :to="step.to"
        class="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.92rem] font-semibold"
      >
        {{ step.cta }} <AppIcon name="arrow-right" :size="16" />
      </NuxtLink>
      <UiButton v-else-if="step.instagram" :href="INSTAGRAM.href" variant="gold" icon="instagram" class="mt-3">
        {{ step.cta }}
      </UiButton>
    </li>
  </ol>
</template>
