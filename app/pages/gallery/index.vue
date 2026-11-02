<script setup lang="ts">
useHead({ title: 'Gallery' })
useSeoMeta({ description: 'Le foto degli eventi di gioco di ruolo dal vivo organizzati da FulcronGRV.' })

const { data: albums, status, refresh } = await useFetch('/api/albums', { default: () => [] })
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
        <article v-for="album in albums" :key="album.id" class="card">
          <div class="card-media">
            <img :src="album.cover" :alt="`Copertina dell’album ${album.name}`" loading="lazy" />
          </div>
          <div class="card-body">
            <h2 class="card-title">{{ album.name }}</h2>
            <p class="card-meta meta">
              <span><AppIcon name="calendar" :size="16" /> {{ formatDate(album.date) }}</span>
              <span v-if="album.placeIG || album.place">
                <AppIcon name="pin" :size="16" />
                {{ album.placeIG }}<template v-if="album.placeIG && album.place"> · </template>{{ album.place }}
              </span>
            </p>
            <div class="card-actions">
              <NuxtLink
                v-if="album.slug"
                :to="`/gallery/${album.slug}`"
                class="btn btn-primary"
                :aria-label="`Vedi le foto di ${album.name}`"
              >
                <AppIcon name="image" :size="18" /> Vedi le foto
              </NuxtLink>
              <a
                v-if="album.highQuality"
                :href="album.highQuality"
                target="_blank"
                rel="noopener"
                class="btn btn-outline"
                :aria-label="`Scarica in alta qualità le foto di ${album.name}`"
              >
                <AppIcon name="download" :size="18" /> Alta qualità
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
}
.meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
</style>
