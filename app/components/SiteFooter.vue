<script setup lang="ts">
// Computed at build time and reused on the client: no hydration mismatch
const year = useState('footer-year', () => new Date().getFullYear())

const columns = [
  {
    title: 'Esplora',
    links: [
      { to: '/chi-siamo', label: 'Chi siamo' },
      { to: '/oneshot', label: 'Oneshot' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/inizia-a-giocare', label: 'Inizia a giocare' },
    ],
  },
  {
    title: 'La campagna',
    links: [
      { to: '/sinfonia', label: 'La Sinfonia dei Sette' },
      { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
      { to: '/sinfonia/regolamento', label: 'Regolamento e manuali' },
      { to: '/sinfonia/eventi', label: 'Eventi giocati' },
      { to: '/sinfonia/bacheca', label: 'Bacheca' },
      { to: '/wiki', label: 'Wiki di Fulcron' },
    ],
  },
]

// Comfortable tap height on touch layouts, compact on desktop
const linkClass = 'inline-flex items-center text-on-dark-muted no-underline hover:text-gold-soft max-lg:min-h-11'

// Legal line, split into pieces that never break in the middle (e.g. "C.F. 91407660371")
const legal = [
  { text: `© ${year.value} ${ASSOCIATION.name}`, after: ' · ' },
  { text: `${ASSOCIATION.street},`, after: ' ' },
  { text: `${ASSOCIATION.postalCode} ${ASSOCIATION.city} (${ASSOCIATION.province})`, after: ' · ' },
  { text: `C.F. ${ASSOCIATION.taxCode}`, after: '' },
]
</script>

<template>
  <footer class="on-dark mt-auto border-t border-gold-soft/25 bg-ink-deep text-[0.95rem] text-on-dark-muted">
    <div class="container-site grid gap-10 pt-14 pb-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
      <div>
        <NuxtLink
          to="/"
          class="mb-4 inline-flex items-center gap-3 font-display text-2xl text-on-dark no-underline hover:text-gold-soft"
        >
          <NuxtImg
            src="/logos/logo_bianco_trim.png"
            alt=""
            width="40"
            height="40"
            densities="x1 x2"
            format="webp"
            loading="lazy"
          />
          <span>FulcronGRV</span>
        </NuxtLink>
        <p class="max-w-[38ch]">
          Associazione di gioco di ruolo dal vivo nata tra i boschi dell’Appennino Tosco-Emiliano.
        </p>
      </div>

      <nav v-for="col in columns" :key="col.title" :aria-label="col.title">
        <h2 class="mb-4 font-display text-base tracking-[0.12em] text-gold-soft">{{ col.title }}</h2>
        <ul class="lg:space-y-1.5">
          <li v-for="link in col.links" :key="link.label">
            <NuxtLink :to="link.to" :class="linkClass">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-4 font-display text-base tracking-[0.12em] text-gold-soft">Contatti</h2>
        <p class="mb-3">Date, iscrizioni e domande: tutto passa da Instagram.</p>
        <a
          :href="INSTAGRAM.href"
          target="_blank"
          rel="noopener"
          :class="[linkClass, 'inline-flex min-h-11 items-center gap-2 font-semibold text-on-dark']"
        >
          <AppIcon name="instagram" :size="20" /> {{ INSTAGRAM.handle }}
        </a>
      </div>
    </div>

    <div class="container-site flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/10 py-5 text-sm">
      <p>
        <template v-for="part in legal" :key="part.text"
          ><span class="whitespace-nowrap">{{ part.text }}</span
          >{{ part.after }}</template
        >
      </p>
      <NuxtLink to="/privacy" :class="linkClass">Privacy</NuxtLink>
    </div>
  </footer>
</template>
