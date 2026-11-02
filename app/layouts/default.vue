<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#contenuto"
      class="absolute -top-24 left-4 z-100 rounded-lg bg-gold px-4 py-2.5 font-semibold text-ink-deep focus:top-4"
    >
      Vai al contenuto
    </a>
    <SiteHeader />
    <main id="contenuto" class="flex-1" :class="$route.path !== '/' && 'pt-header'">
      <slot />
    </main>
    <SiteFooter />
    <ScrollTop />
  </div>
</template>
