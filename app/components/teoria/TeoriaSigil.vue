<script setup lang="ts">
// Polveri and Semi are traced from the original 2019 cards. The cards of Angeli and Sephiri are lost:
// their marks are redrawn on the same rules (one open outline around a solid dot), and are not originals
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 453 440" aria-hidden="true" fill="currentColor">
    <path v-if="name === 'Polveri'" d="M226 32 385 250 298 425H248L345 250 226 100 107 250 203 425H150L57 250Z" />
    <path
      v-else-if="name === 'Semi'"
      d="M216 46 186 34 104 196C60 290 92 414 207 419V388C120 384 96 290 132 212ZM237 46 267 34 349 196C393 290 361 414 246 419V388C333 384 357 290 321 212Z"
    />
    <path
      v-else-if="name === 'Angeli'"
      d="M12 250C80 150 150 108 214 102V136C160 142 106 176 58 250 106 324 160 358 214 364V398C150 392 80 350 12 250ZM441 250C373 150 303 108 239 102V136C293 142 347 176 395 250 347 324 293 358 239 364V398C303 392 373 350 441 250Z"
    />
    <path v-else d="M86 425V36H367V425H322V82H131V425Z" />
    <circle cx="226" :cy="name === 'Sephiri' ? 250 : name === 'Angeli' ? 250 : name === 'Semi' ? 273 : 268" r="46" />
  </svg>
</template>
