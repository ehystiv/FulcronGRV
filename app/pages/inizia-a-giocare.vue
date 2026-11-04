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
      <NextEvent v-reveal />
    </section>
  </div>
</template>
