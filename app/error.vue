<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error?.statusCode === 404)

useHead({ title: notFound.value ? 'Pagina non trovata' : 'Errore' })
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
      <UiButton class="mt-6" @click="clearError({ redirect: '/' })">Torna alla home</UiButton>
    </section>
  </NuxtLayout>
</template>
