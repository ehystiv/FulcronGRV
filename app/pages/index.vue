<script setup lang="ts">
useHead({ title: 'FulcronGRV' })
useSeoMeta({ ogTitle: 'FulcronGRV · Gioco di ruolo dal vivo' })

const features = [
  {
    to: '/sinfonia/ambientazione',
    eyebrow: 'La campagna',
    title: 'La Sinfonia dei Sette',
    text: 'Un mondo fantasy originale, vivo e in continuo mutamento, che risponde alle azioni dei giocatori evento dopo evento.',
    image: '/immagini/origini_2.jpg',
  },
  {
    to: '/oneshot',
    eyebrow: 'Avventure singole',
    title: 'Oneshot',
    text: 'Storie autoconclusive con temi e ambientazioni sempre diversi: horror, fantascienza, intrighi di corte.',
    image: '/oneshots/TearAsunder.jpg',
  },
  {
    to: '/gallery',
    eyebrow: 'Ricordi',
    title: 'Gallery',
    text: 'Le foto dei nostri eventi: costumi, battaglie, banchetti e tutte le storie che abbiamo vissuto insieme.',
    image: '/albums/banchettodeiguitti.jpg',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Associazione FulcronGRV',
  url: useRuntimeConfig().public.siteUrl,
  logo: useRuntimeConfig().public.siteUrl + '/logos/logo_blu.png',
  sameAs: SOCIAL_LINKS.map((s) => s.href),
}
useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }] })
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-bg">
        <SiteImage src="/backgrounds/forest_op_comp.jpg" loading="eager" fetchpriority="high" />
      </div>
      <div class="hero-overlay" aria-hidden="true" />
      <div class="container hero-content">
        <img class="hero-logo" src="/logos/logo_bianco.png" alt="" width="220" height="220" />
        <span class="eyebrow">Associazione di gioco di ruolo dal vivo</span>
        <h1>Benvenuto a Fulcron</h1>
        <p class="hero-lead">Vivi la tua avventura, ora. Scopri le magiche e vive terre dell’Anello.</p>
        <div class="btn-row hero-actions">
          <NuxtLink to="/sinfonia/ambientazione" class="btn btn-gold">
            Scopri la Sinfonia dei Sette
            <AppIcon name="arrow-right" :size="18" />
          </NuxtLink>
          <NuxtLink to="/chi-siamo" class="btn btn-ghost-light">Chi siamo</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section intro">
      <div v-reveal class="container prose center">
        <span class="eyebrow">Salve, viandante</span>
        <h2>Un mondo da vivere, non solo da raccontare</h2>
        <div class="divider" aria-hidden="true"><span /></div>
        <p class="lead">
          FulcronGRV nasce da un gruppo di amici e dalla voglia di vivere in mondi fantastici. Tra i boschi
          dell’Appennino Tosco-Emiliano organizziamo una campagna continuativa e oneshot con ambientazioni sempre nuove:
          indossa i panni del tuo personaggio e fai parte della storia.
        </p>
      </div>
    </section>

    <section class="section features">
      <div class="container grid">
        <NuxtLink v-for="(f, i) in features" :key="f.to" v-reveal="i * 120" :to="f.to" class="card feature">
          <div class="card-media">
            <SiteImage :src="f.image" sizes="sm:100vw md:50vw lg:400px" />
          </div>
          <div class="card-body">
            <span class="eyebrow">{{ f.eyebrow }}</span>
            <h3 class="card-title">{{ f.title }}</h3>
            <p class="muted">{{ f.text }}</p>
            <span class="more">Scopri di più <AppIcon name="arrow-right" :size="16" /></span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="section join">
      <div v-reveal class="container join-inner">
        <div>
          <h2>Unisciti all’avventura</h2>
          <p>
            Segui i nostri canali per conoscere le date dei prossimi eventi, iscriverti e restare aggiornato sulle
            vicende dell’Anello.
          </p>
        </div>
        <ul class="join-social">
          <li v-for="s in SOCIAL_LINKS" :key="s.name">
            <a :href="s.href" target="_blank" rel="noopener" class="btn btn-ghost-light">
              <AppIcon :name="s.name" :size="18" />
              {{ s.label }}
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: min(100svh, 900px);
  display: grid;
  place-items: center;
  overflow: hidden;
  color: var(--on-dark);
  isolation: isolate;
}
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
}
.hero-bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse at center, rgb(0 26 38 / 0.35), rgb(0 26 38 / 0.8) 75%),
    linear-gradient(180deg, rgb(0 26 38 / 0.7) 0%, rgb(0 64 19 / 0.25) 45%, rgb(0 26 38 / 0.95) 100%);
}
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-block: calc(var(--header-h) + 3rem) 5rem;
}
.hero-logo {
  width: clamp(130px, 22vw, 220px);
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 6px 24px rgb(0 0 0 / 0.5));
  animation: turn 90s linear infinite;
}
@keyframes turn {
  to {
    transform: rotate(360deg);
  }
}
.hero .eyebrow {
  color: var(--gold-soft);
}
.hero h1 {
  color: #fff;
  font-size: clamp(2.6rem, 7vw, 5rem);
  text-shadow: 0 4px 30px rgb(0 0 0 / 0.5);
  margin-bottom: 0.3em;
}
.hero-lead {
  font-size: clamp(1.1rem, 2.4vw, 1.35rem);
  max-width: 40ch;
  color: var(--on-dark);
}
.hero-actions {
  justify-content: center;
  margin-top: 1rem;
}

.intro {
  padding-bottom: 1rem;
}

.feature {
  color: inherit;
  text-decoration: none;
}
.feature .eyebrow {
  margin-bottom: 0.35rem;
}
.more {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--teal);
}
.feature:hover .more {
  color: var(--forest);
}

.join {
  background:
    radial-gradient(ellipse at top right, rgb(184 145 63 / 0.18), transparent 55%),
    linear-gradient(135deg, var(--ink-deep), var(--ink) 55%, var(--forest));
  color: var(--on-dark);
}
.join h2 {
  color: #fff;
}
.join-inner {
  display: grid;
  gap: 2rem;
  align-items: center;
}
@media (min-width: 900px) {
  .join-inner {
    grid-template-columns: 1fr 1fr;
  }
}
.join-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
