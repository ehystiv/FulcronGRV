<script setup lang="ts">
useHead({ title: 'Gallery' })
useSeoMeta({ description: 'Le foto degli eventi di gioco di ruolo dal vivo organizzati da FulcronGRV.' })

const {
  data: albums,
  status,
  refresh,
} = await useAsyncData('gallery', () => queryCollection('gallery').order('date', 'DESC').all(), {
  default: () => [],
})
</script>

<template>
  <div>
    <PageHero eyebrow="Ricordi" title="Gallery" lead="Le foto dei nostri eventi, album per album." />

    <div class="container section">
      <StateMessage
        :status="status"
        :empty="!albums.length"
        empty-text="Non ci sono ancora album da mostrare."
        @retry="refresh()"
      />

      <div v-if="status === 'success' && albums.length" class="grid">
        <article v-for="(album, i) in albums" :key="album.path" v-reveal="(i % 3) * 100" class="card album">
          <div class="card-media">
            <SiteImage
              :src="album.cover"
              :alt="`Copertina dell’album ${album.title}`"
              sizes="sm:100vw md:50vw lg:400px"
            />
            <time class="badge" :datetime="String(album.date)">{{ formatDate(album.date) }}</time>
          </div>
          <div class="card-body">
            <h2 class="card-title">{{ album.title }}</h2>
            <p class="card-meta place">
              <template v-if="album.placeIG || album.place">
                <AppIcon name="pin" :size="16" />
                <span>
                  {{ album.placeIG }}<template v-if="album.placeIG && album.place"> · </template>{{ album.place }}
                </span>
              </template>
            </p>
            <div class="card-actions">
              <NuxtLink
                :to="`/gallery/${albumFolder(album)}`"
                class="btn btn-primary btn-sm"
                :aria-label="`Vedi le foto di ${album.title}`"
              >
                <AppIcon name="image" :size="16" /> Vedi le foto
              </NuxtLink>
              <a
                v-if="album.highQuality"
                :href="album.highQuality"
                target="_blank"
                rel="noopener"
                class="btn btn-outline btn-sm"
                :aria-label="`Scarica in alta qualità le foto di ${album.title}`"
              >
                <AppIcon name="download" :size="16" /> Alta qualità
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.album .card-media {
  position: relative;
}
.badge {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgb(0 26 38 / 0.82);
  backdrop-filter: blur(4px);
  color: var(--on-dark);
  font-size: 0.8rem;
  font-weight: 500;
}
.place {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  /* Keeps the cards aligned even when the place is missing */
  min-height: 1.6em;
}
.place :deep(svg) {
  flex-shrink: 0;
}
.album .card-actions {
  flex-wrap: nowrap;
}
</style>
