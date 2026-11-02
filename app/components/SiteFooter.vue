<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="about">
        <NuxtLink to="/" class="brand">
          <img src="/logos/logo_bianco.png" alt="" width="44" height="44" loading="lazy" />
          <span>FulcronGRV</span>
        </NuxtLink>
        <p>Associazione di gioco di ruolo dal vivo nata tra i boschi dell’Appennino Tosco-Emiliano.</p>
      </div>

      <nav aria-label="Mappa del sito">
        <h2 class="footer-title">Esplora</h2>
        <ul>
          <li v-for="link in NAV_LINKS" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
          <li><a :href="WIKI_URL" target="_blank" rel="noopener">Wiki di Fulcron</a></li>
        </ul>
      </nav>

      <div>
        <h2 class="footer-title">Seguici</h2>
        <ul class="social">
          <li v-for="s in SOCIAL_LINKS" :key="s.name">
            <a :href="s.href" target="_blank" rel="noopener" :aria-label="s.label" :title="s.label">
              <AppIcon :name="s.name" :size="20" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container legal">
      <p>© {{ year }} Associazione FulcronGRV</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Computed once at build/SSR time and reused on the client: no hydration mismatch.
const year = useState('footer-year', () => new Date().getFullYear())
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  background: var(--ink-deep);
  color: var(--on-dark-muted);
  font-size: 0.95rem;
  border-top: 1px solid rgb(217 191 127 / 0.25);
}
.footer-grid {
  display: grid;
  gap: 2.5rem;
  padding-block: 3.5rem 2.5rem;
  grid-template-columns: 1fr;
}
@media (min-width: 760px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--on-dark);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.about p {
  max-width: 38ch;
}
.footer-title {
  color: var(--gold-soft);
  font-size: 1rem;
  letter-spacing: 0.12em;
  margin-bottom: 1rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 0.4rem;
}
a {
  color: var(--on-dark-muted);
  text-decoration: none;
}
a:hover {
  color: var(--gold-soft);
}
.social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.social a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 0.14);
  color: var(--on-dark);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.social a:hover {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink-deep);
}
.legal {
  border-top: 1px solid rgb(255 255 255 / 0.08);
  padding-block: 1.25rem;
  font-size: 0.85rem;
}
.legal p {
  margin: 0;
}
</style>
