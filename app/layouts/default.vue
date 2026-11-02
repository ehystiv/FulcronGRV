<template>
  <div class="layout">
    <a href="#contenuto" class="skip-link">Vai al contenuto</a>
    <SiteHeader />
    <main id="contenuto" class="main" :class="{ 'main--hero': $route.path === '/' }">
      <slot />
    </main>
    <SiteFooter />
    <ScrollTop />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex: 1;
  padding-top: var(--header-h);
}
.main--hero {
  padding-top: 0;
}
.skip-link {
  position: absolute;
  left: 1rem;
  top: -100px;
  z-index: 100;
  padding: 0.6rem 1rem;
  background: var(--gold);
  color: var(--ink-deep);
  border-radius: var(--radius-sm);
  font-weight: 600;
}
.skip-link:focus {
  top: 1rem;
}
</style>
