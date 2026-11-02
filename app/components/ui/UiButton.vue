<script setup lang="ts">
// One button for the whole site: renders a NuxtLink (to), a link (href) or a <button>.
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'primary' | 'gold' | 'outline' | 'ghost'
    size?: 'sm' | 'md'
    icon?: string
    iconRight?: string
  }>(),
  { variant: 'primary', size: 'md' },
)

const variants = {
  primary: 'border-transparent bg-ink text-on-dark hover:bg-teal hover:text-white',
  gold: 'border-transparent bg-gold text-ink-deep hover:bg-gold-soft hover:text-ink-deep',
  outline: 'border-ink/70 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-on-dark',
  ghost: 'border-on-dark/55 bg-white/5 text-on-dark backdrop-blur-sm hover:bg-on-dark hover:text-ink-deep',
}
const sizes = {
  sm: 'min-h-9.5 px-4 py-2 text-[0.85rem]',
  md: 'min-h-11 px-[1.4rem] py-2.5 text-[0.92rem]',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full border font-semibold leading-none tracking-wide no-underline transition hover:-translate-y-px',
  variants[props.variant],
  sizes[props.size],
])
const iconSize = computed(() => (props.size === 'sm' ? 16 : 18))
const isExternal = computed(() => !!props.href && /^https?:\/\//.test(props.href))
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <AppIcon v-if="icon" :name="icon" :size="iconSize" />
    <slot />
    <AppIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener' : undefined"
  >
    <AppIcon v-if="icon" :name="icon" :size="iconSize" />
    <slot />
    <AppIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </a>
  <button v-else type="button" :class="classes">
    <AppIcon v-if="icon" :name="icon" :size="iconSize" />
    <slot />
    <AppIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </button>
</template>
