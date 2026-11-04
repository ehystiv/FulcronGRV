<script setup lang="ts">
// Justified rows: each photo gets a width proportional to its ratio, so all of a row is
// the same height and nothing is cropped
defineProps<{
  title: string
  rows: { src: string; alt: string; width: number; height: number }[][]
}>()
</script>

<template>
  <section class="sunless-gallery">
    <h4>{{ title }}</h4>
    <div v-for="(row, i) in rows" :key="i" class="sunless-gallery__row">
      <div
        v-for="photo in row"
        :key="photo.src"
        class="sunless-gallery__photo"
        :style="{ flexGrow: photo.width / photo.height, aspectRatio: `${photo.width} / ${photo.height}` }"
      >
        <SiteImage
          :src="photo.src"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
          :sizes="row.length === 1 ? 'sm:100vw lg:100vw' : 'sm:100vw md:50vw'"
        />
      </div>
    </div>
    <div class="sunless-gallery__note"><slot /></div>
  </section>
</template>
