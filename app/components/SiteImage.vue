<script setup lang="ts">
// Optimized image: files from public/ go through @nuxt/image (WebP, resized
// per screen at build time); external URLs are rendered as a plain <img>.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    sizes?: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
  }>(),
  { alt: '', sizes: 'sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw', loading: 'lazy' },
)

const isLocal = computed(() => props.src.startsWith('/') && !props.src.startsWith('//'))
// Paths may be URL-encoded or not ("Demoni del Sud.jpg"): @nuxt/image encodes them itself
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
    :loading="loading"
    :fetchpriority="fetchpriority"
    format="webp"
    class="contents"
    :img-attrs="{ ...$attrs, decoding: 'async' }"
  />
  <img
    v-else
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    decoding="async"
  />
</template>
