<script setup lang="ts">
useHead({ title: 'Bacheca' })
useSeoMeta({ description: 'Le notizie dal mondo di Fulcron e dalla campagna La Sinfonia dei Sette.' })

const {
  data: posts,
  status,
  refresh,
} = await useAsyncData('bacheca', () => queryCollection('bacheca').order('date', 'DESC').all(), {
  default: () => [],
})
</script>

<template>
  <div class="container section">
    <div class="head">
      <h1>Bacheca</h1>
      <p class="lead">Le notizie dall’Anello, così come arrivano.</p>
    </div>

    <StateMessage
      :status="status"
      :empty="!posts.length"
      empty-text="Non ci sono ancora notizie in bacheca."
      @retry="refresh()"
    />

    <div v-if="status === 'success' && posts.length" class="feed">
      <article v-for="post in posts" :key="post.path" v-reveal class="card post">
        <div v-if="post.image" class="card-media">
          <SiteImage :src="post.image" :alt="post.title" sizes="sm:100vw md:760px" />
        </div>
        <div class="card-body">
          <p class="card-meta">
            <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
          </p>
          <h2 class="card-title">{{ post.title }}</h2>
          <ContentRenderer :value="post" class="post-text" />
          <ul v-if="post.tags?.length" class="chips">
            <li v-for="tag in post.tags" :key="tag" class="chip">{{ tag }}</li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.head {
  text-align: center;
  margin-bottom: 2.5rem;
}
.feed {
  display: grid;
  gap: 1.75rem;
  max-width: 760px;
  margin-inline: auto;
}
.post .card-media {
  aspect-ratio: auto;
  max-height: 520px;
}
.post .card-media :deep(img) {
  object-fit: contain;
  background: var(--ink-deep);
}
.post:hover {
  transform: none;
}
.post:hover .card-media :deep(img) {
  transform: none;
}
.post-text {
  margin-bottom: 1rem;
}
</style>
