<script setup lang="ts">
const kinds = ['bad', 'good'] as const
</script>

<template>
  <!-- ::examples with #bad and #good slots (quotes) -->
  <div class="not-prose my-6 grid gap-4 md:grid-cols-2">
    <div
      v-for="kind in kinds"
      :key="kind"
      class="rounded-lg border border-line bg-surface px-5 py-4 [&_blockquote]:mt-2.5 [&_blockquote]:border-l-[3px] [&_blockquote]:py-1 [&_blockquote]:pl-3.5 [&_blockquote]:italic"
      :class="kind === 'bad' ? '[&_blockquote]:border-danger-soft' : '[&_blockquote]:border-forest'"
    >
      <span
        class="text-xs font-semibold tracking-[0.14em] uppercase"
        :class="kind === 'bad' ? 'text-danger' : 'text-forest'"
      >
        {{ kind === 'bad' ? 'Da evitare' : 'Molto meglio' }}
      </span>
      <slot :name="kind" />
    </div>
  </div>
</template>
