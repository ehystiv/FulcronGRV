<script setup lang="ts">
defineProps<{ when: string; where: string; players: string; price: string }>()
</script>

<template>
  <section class="teoria-facts">
    <h2 class="teoria-label">L’evento</h2>
    <dl>
      <div>
        <dt>Quando</dt>
        <dd>{{ when }}</dd>
      </div>
      <div>
        <dt>Dove</dt>
        <dd>{{ where }}</dd>
      </div>
      <div>
        <dt>Partecipanti</dt>
        <dd>{{ players }}</dd>
      </div>
      <div>
        <dt>Quota</dt>
        <dd>{{ price }}</dd>
      </div>
    </dl>
    <div class="teoria-facts__note"><slot /></div>
  </section>
</template>
