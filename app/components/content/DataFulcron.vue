<script setup lang="ts">
// ::data-fulcron — converts one of our dates into the calendar of Fulcron, starting from today.
// The site is static: today is only known in the browser, so the box fills in once the page is open.
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const scelta = ref('')
onMounted(() => (scelta.value = iso(new Date())))

const risultato = computed(() => {
  const [a, m, g] = scelta.value.split('-').map(Number)
  if (!a || !m || !g) return null
  return dataFulcron(new Date(a, m - 1, g))
})
const id = useId()
</script>

<template>
  <div class="not-prose my-8 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
    <label :for="id" class="mb-2 block text-sm font-semibold text-ink">Una data del nostro calendario</label>
    <input
      :id="id"
      v-model="scelta"
      type="date"
      min="0001-01-01"
      class="min-h-11 w-full max-w-60 rounded-lg border border-line bg-parchment px-3 py-2 text-ink focus:border-gold-ink focus:outline-none"
    />
    <p class="mt-5 mb-1 text-xs font-semibold tracking-[0.18em] text-gold-ink uppercase">A Fulcron è</p>
    <p class="m-0 min-h-[1.4em] font-display text-[clamp(1.4rem,3.5vw,1.9rem)] text-ink" aria-live="polite">
      {{ risultato?.testo }}
    </p>
    <p v-if="risultato?.festa" class="mt-2 mb-0 font-semibold text-gold-ink notte:text-shadow-luce">
      ✦ {{ risultato.festa }}
    </p>
  </div>
</template>
