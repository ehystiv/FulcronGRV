<script setup lang="ts">
// Downloadable PDFs, one row per document: "Leggi" opens the screen version, "Stampa" the printer-friendly one.
// `file` and `print` are file names in the documents bucket (runtimeConfig.public.documentsUrl), or full URLs.
type Doc = { title: string; file: string; size: string; print?: string; printSize?: string }
defineProps<{ items: Doc[] }>()

const base = useRuntimeConfig().public.documentsUrl.replace(/\/$/, '')
const url = (file: string) => (/^(https?:)?\/\//.test(file) || file.startsWith('/') ? file : `${base}/${file}`)

const linkClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 py-2 text-[0.92rem] sm:px-4 font-semibold whitespace-nowrap no-underline transition'
</script>

<template>
  <ul class="not-prose grid list-none gap-3 p-0">
    <li
      v-for="doc in items"
      :key="doc.file"
      class="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-line bg-surface px-5 py-4 text-ink"
    >
      <AppIcon name="file" :size="28" class="shrink-0" />
      <strong class="min-w-[12rem] flex-1 leading-snug">{{ doc.title }}</strong>
      <!-- Side by side, half width each on phones -->
      <span class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
        <a
          :href="url(doc.file)"
          target="_blank"
          rel="noopener"
          :class="[linkClass, 'border-gold bg-gold text-ink-deep hover:bg-gold-soft']"
          :aria-label="`Leggi ${doc.title}, PDF da ${doc.size}`"
        >
          <AppIcon name="download" :size="18" class="shrink-0" />
          Leggi <span class="font-normal opacity-80">{{ doc.size }}</span>
        </a>
        <a
          v-if="doc.print"
          :href="url(doc.print)"
          target="_blank"
          rel="noopener"
          :class="[linkClass, 'border-line text-ink hover:border-gold']"
          :aria-label="`${doc.title} da stampare, PDF da ${doc.printSize}`"
        >
          <AppIcon name="print" :size="18" class="shrink-0" />
          Stampa <span class="font-normal text-muted">{{ doc.printSize }}</span>
        </a>
      </span>
    </li>
  </ul>
</template>
