<script setup lang="ts">
const page = await usePage('inizia-a-giocare')
</script>

<template>
  <div>
    <PageHero :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" />

    <ContentRenderer
      :value="page"
      class="prose-fulcron container-site py-[clamp(3rem,8vw,5.5rem)] [&_h2]:text-center [&_h2:not(:first-child)]:mt-20"
    />

    <section class="container-site pb-[clamp(3rem,8vw,5.5rem)]">
      <div
        v-reveal
        class="ornate mx-auto max-w-190 rounded-card border border-line bg-surface p-[clamp(2rem,5vw,3rem)] text-center"
      >
        <h2 class="mb-3 text-[clamp(1.6rem,3.2vw,2.3rem)]">Hai ancora qualche dubbio?</h2>
        <p>Scrivici dove ti è più comodo, ti rispondiamo appena possiamo.</p>
        <ul class="mt-6 flex flex-wrap justify-center gap-2.5">
          <li v-for="s in SOCIAL_LINKS" :key="s.name">
            <UiButton :href="s.href" variant="outline" size="sm" :icon="s.name">{{ s.label }}</UiButton>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
