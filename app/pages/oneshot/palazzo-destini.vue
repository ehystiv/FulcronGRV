<script setup lang="ts">
const page = await usePage('palazzo-destini')
</script>

<template>
  <div>
    <PageHero :eyebrow="page.eyebrow" :title="page.title">
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <UiButton
          v-for="link in page.links"
          :key="link.href"
          :href="link.href"
          :variant="link.primary ? 'primary' : 'outline'"
        >
          {{ link.label }}
        </UiButton>
      </div>
    </PageHero>

    <div
      class="container-site grid items-start gap-12 py-[clamp(3rem,8vw,5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
    >
      <ContentRenderer
        :value="page"
        class="prose-fulcron max-w-[60ch] italic [&_h3]:font-heading [&_h3]:text-[1.35rem] [&_h3]:not-italic"
      />
      <figure v-if="page.image" v-reveal class="m-0 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
        <SiteImage
          :src="page.image"
          :alt="`Locandina dell’evento ${page.title}`"
          sizes="sm:100vw md:100vw lg:520px"
          class="w-full rounded-card shadow-card-lg"
        />
      </figure>
    </div>
  </div>
</template>
