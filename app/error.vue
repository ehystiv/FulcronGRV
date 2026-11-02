<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error?.statusCode === 404)

useHead({ title: notFound.value ? 'Pagina non trovata' : 'Errore' })

if (!notFound.value) console.error(props.error)
</script>

<template>
  <NuxtLayout>
    <section class="error container">
      <span class="eyebrow">Errore {{ error?.statusCode ?? 500 }}</span>
      <h1>{{ notFound ? 'Questa strada non porta da nessuna parte' : 'Qualcosa è andato storto' }}</h1>
      <div class="divider" aria-hidden="true"><span /></div>
      <p class="lead">
        {{
          notFound
            ? 'Anche i viandanti più esperti a volte si perdono. La pagina che cerchi non esiste o è stata spostata.'
            : 'Si è verificato un errore imprevisto. Riprova tra qualche istante.'
        }}
      </p>
      <button class="btn btn-primary" type="button" @click="clearError({ redirect: '/' })">Torna alla home</button>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-block: 5rem;
}
.lead {
  max-width: 55ch;
}
</style>
