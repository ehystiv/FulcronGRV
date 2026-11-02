<script setup lang="ts">
// Optimized image: files from /public go through @nuxt/image (WebP,
// resized for the screen); anything else (external URLs) is a plain <img>.
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    sizes?: string
    width?: number | string
    height?: number | string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
  }>(),
  { alt: '', sizes: 'sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw', loading: 'lazy' },
)

const isLocal = computed(
  () => props.src.startsWith('/') && !props.src.startsWith('//') && !props.src.startsWith('/foto/'),
)
// Paths stored in the DB may be URL-encoded or not ("Demoni del Sud.jpg"):
// @nuxt/image encodes them itself, so it must receive the decoded path.
const localSrc = computed(() => {
  try {
    return decodeURI(props.src)
  } catch {
    return props.src
  }
})
</script>

<template>
  <NuxtPicture
    v-if="isLocal"
    :src="localSrc"
    :alt="alt"
    :sizes="sizes"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    format="webp"
    :img-attrs="{ decoding: 'async' }"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    decoding="async"
  />
</template>

<style scoped>
/* <picture> must not break the layout of the parent (cover images, etc.) */
picture {
  display: contents;
}
</style>
