<script setup lang="ts">
// "Prossimo evento" box, from content/pagine/prossimo-evento.md.
// Without a date, or once `until` has passed, it says the next one is being prepared and points to Instagram.
const { data: event } = await useAsyncData('prossimo-evento', () =>
  queryCollection('pagine').path('/pagine/prossimo-evento').first(),
)

// The site is static: checked at build time and again in the browser, so an old build cannot keep a past event up
const isOver = () => {
  const until = event.value?.until
  return !!until && new Date(`${until}T23:59:59`).getTime() < Date.now()
}
const over = useState('prossimo-evento-over', isOver)
onMounted(() => (over.value = isOver()))

const scheduled = computed(() => !!event.value?.date && !over.value)
</script>

<template>
  <div
    class="mx-auto flex max-w-190 flex-col items-center gap-5 rounded-card border border-line bg-surface p-[clamp(1.5rem,4vw,2.5rem)] text-center shadow-card"
  >
    <template v-if="scheduled && event">
      <h2 class="m-0 text-[clamp(1.5rem,3vw,2rem)]">{{ event.title }}</h2>
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-ink">
        <li class="inline-flex items-center gap-2"><AppIcon name="calendar" :size="18" /> {{ event.date }}</li>
        <li v-if="event.place" class="inline-flex items-center gap-2">
          <AppIcon name="pin" :size="18" /> {{ event.place }}
        </li>
        <li v-if="event.cost" class="font-semibold">{{ event.cost }}</li>
      </ul>
      <ContentRenderer :value="event" class="prose-fulcron prose-base max-w-[60ch] text-muted" />
      <UiButton v-if="event.link" :href="event.link" variant="gold" icon-right="arrow-right">Iscriviti</UiButton>
      <UiButton v-else :href="INSTAGRAM.href" variant="gold" icon="instagram">Iscriviti su Instagram</UiButton>
    </template>

    <template v-else>
      <h2 class="m-0 text-[clamp(1.5rem,3vw,2rem)]">Prossimo evento</h2>
      <p class="m-0 max-w-[46ch] text-muted">
        Siamo fermi da un po’, ma il prossimo evento è in preparazione. Date e iscrizioni le annunciamo su Instagram:
        seguici per non perderlo, e scrivici lì se hai domande.
      </p>
      <UiButton :href="INSTAGRAM.href" variant="outline" icon="instagram">Seguici su Instagram</UiButton>
      <NuxtLink to="/oneshot" class="inline-flex min-h-11 items-center gap-1.5 text-[0.92rem] font-semibold">
        Intanto, guarda le nostre oneshot <AppIcon name="arrow-right" :size="16" />
      </NuxtLink>
    </template>
  </div>
</template>
