<script setup lang="ts">
// Card with optional cover image. With `to` the whole card is a link.
withDefaults(
  defineProps<{
    to?: string
    image?: string
    imageAlt?: string
    imageSizes?: string
    mediaClass?: string
    hover?: boolean
  }>(),
  { imageAlt: '', imageSizes: 'sm:100vw md:50vw lg:400px', mediaClass: 'aspect-16/10', hover: true },
)
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'article'"
    :to="to"
    class="group flex flex-col overflow-hidden rounded-card border border-line bg-surface text-body no-underline shadow-card transition duration-300"
    :class="hover && 'hover:-translate-y-0.5 hover:text-body hover:shadow-card-lg'"
  >
    <div v-if="image || $slots.media" class="relative overflow-hidden bg-surface-2" :class="mediaClass">
      <slot name="media">
        <SiteImage
          :src="image!"
          :alt="imageAlt"
          :sizes="imageSizes"
          class="size-full object-cover transition duration-500"
          :class="hover && 'group-hover:scale-[1.04]'"
        />
      </slot>
    </div>
    <div class="flex flex-1 flex-col px-[1.4rem] pt-5 pb-[1.4rem] [&>:last-child]:mb-0">
      <slot />
    </div>
  </component>
</template>
