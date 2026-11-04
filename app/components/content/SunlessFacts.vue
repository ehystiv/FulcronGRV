<script setup lang="ts">
defineProps<{ start: string; price: string }>()
</script>

<template>
  <section class="sunless-facts">
    <dl>
      <div>
        <dt>Inizio</dt>
        <dd>{{ start }}</dd>
      </div>
      <div>
        <dt>Quota</dt>
        <dd>{{ price }}</dd>
      </div>
    </dl>
    <div class="sunless-facts__note"><slot /></div>
  </section>
</template>
