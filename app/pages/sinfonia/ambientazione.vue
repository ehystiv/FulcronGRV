<script setup lang="ts">
const page = await usePage('ambientazione')
// Table of contents built from the ## headings of the Markdown file
const toc = computed(() => page.value.body?.toc?.links ?? [])
</script>

<template>
  <div class="container-site grid gap-12 py-[clamp(3rem,8vw,5.5rem)] lg:grid-cols-[220px_minmax(0,1fr)]">
    <aside
      class="sticky top-[calc(var(--spacing-header)+var(--spacing-tabs)+2rem)] hidden self-start lg:block"
      aria-label="Indice"
    >
      <p class="mb-2 text-xs font-semibold tracking-[0.16em] text-muted uppercase">In questa pagina</p>
      <ol class="border-l border-line">
        <li v-for="link in toc" :key="link.id">
          <a
            :href="`#${link.id}`"
            class="-ml-px block border-l border-transparent py-1.5 pl-4 text-[0.92rem] text-muted no-underline hover:border-gold hover:text-ink"
          >
            {{ link.text }}
          </a>
        </li>
      </ol>
    </aside>

    <!-- On phones the headings stop below the pinned table of contents -->
    <article class="min-w-0 max-w-205 max-lg:[&_h2]:scroll-mt-14">
      <h1 class="mb-6 text-[clamp(2.2rem,5vw,3.6rem)]">{{ page.title }}</h1>

      <!-- Mobile table of contents -->
      <nav
        class="sticky top-[calc(var(--spacing-header)+1px)] z-10 sm:top-[calc(var(--spacing-header)+var(--spacing-tabs)+1px)] -mx-[clamp(1rem,4vw,2rem)] mb-8 flex gap-2 overflow-x-auto border-b border-line bg-parchment/94 px-[clamp(1rem,4vw,2rem)] py-2.5 backdrop-blur-md [scrollbar-width:none] lg:hidden"
        aria-label="Indice"
      >
        <a
          v-for="link in toc"
          :key="link.id"
          :href="`#${link.id}`"
          class="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line bg-surface px-3.5 text-[0.875rem] font-medium text-ink no-underline hover:border-gold"
        >
          {{ link.text }}
        </a>
      </nav>

      <ContentRenderer
        :value="page"
        class="prose-fulcron [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-12 [&_h2:first-child]:mt-0 [&_h2:first-child]:border-0 [&_h2:first-child]:pt-0"
      />
    </article>
  </div>
</template>
