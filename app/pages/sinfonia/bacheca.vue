<script setup lang="ts">
useSocialMeta({
  title: 'Bacheca',
  description: 'Le notizie dal mondo di Fulcron e dalla campagna La Sinfonia dei Sette.',
})

const { data: posts } = await useAsyncData('bacheca', () => queryCollection('bacheca').order('date', 'DESC').all(), {
  default: () => [],
})
</script>

<template>
  <div class="container-site py-[clamp(3rem,8vw,5.5rem)]">
    <UiSectionTitle
      title="Bacheca"
      :lead="posts.length ? 'Le notizie dall’Anello, così come arrivano.' : undefined"
      as="h1"
      class="mb-10"
    />

    <EmptyState v-if="!posts.length">
      Non ci sono ancora notizie in bacheca. Le novità e il prossimo evento li annunciamo su
      <a :href="INSTAGRAM.href" target="_blank" rel="noopener">Instagram</a>.
    </EmptyState>

    <div v-else class="mx-auto grid max-w-190 gap-7">
      <UiCard v-for="post in posts" :key="post.path" v-reveal :hover="false" media-class="aspect-auto">
        <template v-if="post.image" #media>
          <SiteImage
            :src="post.image"
            :alt="post.title"
            sizes="sm:100vw md:760px"
            class="max-h-130 w-full bg-ink-deep object-contain"
          />
        </template>
        <p class="mb-3 text-sm text-muted">
          <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
        </p>
        <h2 class="mb-1 font-heading text-[1.45rem] tracking-normal">{{ post.title }}</h2>
        <ContentRenderer :value="post" class="prose-fulcron prose-base mb-4" />
        <TagList :tags="post.tags" />
      </UiCard>
    </div>
  </div>
</template>
