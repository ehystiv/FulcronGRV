<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error?.statusCode === 404)
const route = useRoute()
const inWiki = computed(() => notFound.value && route.path.startsWith('/wiki'))

useHead({ title: notFound.value ? 'Pagina non trovata' : 'Errore' })
useNotte()
</script>

<template>
  <NuxtLayout>
    <section class="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <UiSectionTitle
        :eyebrow="`Errore ${error?.statusCode ?? 500}`"
        :title="notFound ? 'Questa strada non porta da nessuna parte' : 'Qualcosa è andato storto'"
        :lead="
          notFound
            ? 'Anche i viandanti più esperti a volte si perdono. La pagina che cerchi non esiste o è stata spostata.'
            : 'Si è verificato un errore imprevisto. Riprova tra qualche istante.'
        "
        as="h1"
      />
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <UiButton v-if="inWiki" to="/wiki" @click="clearError()">Torna alla wiki</UiButton>
        <UiButton :variant="inWiki ? 'outline' : 'primary'" to="/" @click="clearError()">Torna alla home</UiButton>
      </div>
      <LazyBarghestGame v-if="notFound" />
    </section>
  </NuxtLayout>
</template>
