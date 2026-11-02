<script setup lang="ts">
// Loading / empty / error states for data-driven pages.
defineProps<{ status: 'idle' | 'pending' | 'success' | 'error'; empty?: boolean; emptyText?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="status === 'pending'" class="state" role="status">
    <span class="spinner" aria-hidden="true" />
    <p>Caricamento…</p>
  </div>
  <div v-else-if="status === 'error'" class="state" role="alert">
    <p>Al momento non riusciamo a caricare questi contenuti. Riprova tra qualche minuto.</p>
    <button type="button" class="btn btn-outline" @click="$emit('retry')">Riprova</button>
  </div>
  <div v-else-if="empty" class="state">
    <p>{{ emptyText ?? 'Non c’è ancora nulla da mostrare qui.' }}</p>
  </div>
</template>

<style scoped>
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
.state p {
  margin: 0;
  max-width: 50ch;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
