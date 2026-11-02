<script setup lang="ts">
useHead({ title: 'Oneshot' })
useSeoMeta({
  description:
    'Gli eventi oneshot di FulcronGRV: avventure di gioco di ruolo dal vivo autoconclusive con temi e ambientazioni sempre diversi.',
})

const { data: oneshots, status, refresh } = await useFetch('/api/oneshots', { default: () => [] })

function isInternal(url: string | null) {
  return !!url && url.startsWith('/') && !url.startsWith('//')
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Avventure singole"
      title="Oneshot"
      lead="Storie autoconclusive con temi e ambientazioni sempre diverse, lontano (o forse no) dalle terre di Fulcron."
    />

    <div class="container section">
      <NuxtLink to="/oneshot/palazzo-destini" class="featured card ornate">
        <div class="card-media">
          <SiteImage src="/immagini/palazzo-destini.jpg" sizes="sm:100vw md:540px" />
        </div>
        <div class="card-body">
          <span class="eyebrow">In evidenza</span>
          <h2 class="card-title">Il Palazzo dei Destini Incrociati</h2>
          <p class="muted">
            Un banchetto, un ospite misterioso, decine di destini che si intrecciano. Indossa la tua maschera.
          </p>
          <span class="more">Scopri l’evento <AppIcon name="arrow-right" :size="16" /></span>
        </div>
      </NuxtLink>

      <StateMessage
        :status="status"
        :empty="!oneshots.length"
        empty-text="Non ci sono ancora oneshot in archivio."
        @retry="refresh()"
      />

      <div v-if="status === 'success' && oneshots.length" class="grid">
        <article v-for="(oneshot, i) in oneshots" :key="oneshot.id" v-reveal="(i % 3) * 100" class="card">
          <div class="card-media">
            <SiteImage :src="oneshot.image" :alt="`Locandina di ${oneshot.title}`" sizes="sm:100vw md:50vw lg:400px" />
          </div>
          <div class="card-body">
            <h2 class="card-title">{{ oneshot.title }}</h2>
            <p class="card-meta">
              <time :datetime="String(oneshot.date)">{{ formatDate(oneshot.date) }}</time>
            </p>
            <ul v-if="oneshot.tags.length" class="chips">
              <li v-for="tag in oneshot.tags" :key="tag" class="chip">{{ tag }}</li>
            </ul>
            <p v-if="oneshot.description">{{ oneshot.description }}</p>
            <div v-if="oneshot.photos" class="card-actions">
              <NuxtLink v-if="isInternal(oneshot.photos)" :to="oneshot.photos" class="btn btn-outline btn-sm">
                <AppIcon name="image" :size="16" /> Foto dell’evento
              </NuxtLink>
              <a v-else :href="oneshot.photos" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                <AppIcon name="image" :size="16" /> Foto dell’evento
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured {
  color: inherit;
  text-decoration: none;
  margin-bottom: 3rem;
}
@media (min-width: 800px) {
  .featured {
    flex-direction: row;
  }
  .featured .card-media {
    flex: 0 0 45%;
    aspect-ratio: auto;
    min-height: 280px;
  }
  .featured .card-body {
    justify-content: center;
    padding: 2rem 2.5rem;
  }
}
.featured .card-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--teal);
}
</style>
