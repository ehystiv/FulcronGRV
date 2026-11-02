<script setup lang="ts">
useHead({ title: 'Bacheca' })
useSeoMeta({ description: 'Le ultime notizie dal mondo di Fulcron e dalla campagna La Sinfonia dei Sette.' })

const { data: posts, status, refresh } = await useFetch('/api/posts', { default: () => [] })
</script>

<template>
  <div class="container section">
    <div class="head">
      <h1>Bacheca</h1>
      <p class="lead">Rimani aggiornato sul mondo di Fulcron.</p>
    </div>

    <StateMessage
      :status="status"
      :empty="!posts.length"
      empty-text="Nessuna notizia per ora: torna a trovarci presto!"
      @retry="refresh()"
    />

    <div v-if="status === 'success' && posts.length" class="feed">
      <article v-for="post in posts" :key="post.id" class="card post">
        <div v-if="post.image" class="card-media">
          <img :src="post.image" :alt="post.title" loading="lazy" />
        </div>
        <div class="card-body">
          <p class="card-meta">
            <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
          </p>
          <h2 class="card-title">{{ post.title }}</h2>
          <!-- HTML is sanitized server-side in server/api/posts.get.ts -->
          <div class="post-text" v-html="post.html" />
          <ul v-if="post.tags.length" class="chips">
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
.post .card-media img {
  object-fit: contain;
  background: var(--ink-deep);
}
.post:hover {
  transform: none;
}
.post:hover .card-media img {
  transform: none;
}
.post-text {
  margin-bottom: 1rem;
}
</style>
