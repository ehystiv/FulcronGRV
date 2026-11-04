<script setup lang="ts">
// "Prossimo evento" box, from content/pagine/prossimo-evento.md.
// Without a date it says that nothing is scheduled and points to Instagram.
const { data: event } = await useAsyncData('prossimo-evento', () =>
  queryCollection('pagine').path('/pagine/prossimo-evento').first(),
)
const scheduled = computed(() => !!event.value?.date)
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
      <p class="m-0 max-w-[52ch] text-muted">
        Per ora non c’è nessun evento in calendario. Date e iscrizioni le annunciamo su Instagram: seguici per non
        perdere il prossimo, e scrivici lì se hai domande.
      </p>
      <UiButton :href="INSTAGRAM.href" variant="gold" icon="instagram">Seguici su Instagram</UiButton>
    </template>
  </div>
</template>
