<script setup lang="ts">
const page = await usePage('inizia-a-giocare')
</script>

<template>
  <div>
    <PageHero :eyebrow="page.eyebrow" :title="page.title" :lead="page.lead" />

    <!-- container-site sits on a wrapper: prose-fulcron's max-w-none would override it on the same element -->
    <div class="container-site py-[clamp(3rem,8vw,5.5rem)]">
      <ContentRenderer
        :value="page"
        class="prose-fulcron [&>h2]:text-center [&>h2:not(:first-child)]:mt-20 [&>h3]:mx-auto [&>h3]:max-w-3xl [&>p,&>ul]:mx-auto [&>p,&>ul]:max-w-reading"
      />
    </div>

    <section class="container-site pb-[clamp(3rem,8vw,5.5rem)]">
      <NextEvent v-reveal />
    </section>
  </div>
</template>
