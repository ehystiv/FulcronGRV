<script setup lang="ts">
useSeoMeta({ title: 'FulcronGRV', ogTitle: 'FulcronGRV · Gioco di ruolo dal vivo' })

const paths = [
  {
    to: '/inizia-a-giocare',
    title: 'La tua prima volta',
    text: 'Com’è una giornata di gioco, come si crea un personaggio, come si combatte: le risposte alle domande che ci fate più spesso.',
    image: '/immagini/origini_2.jpg',
    cta: 'Inizia da qui',
  },
  {
    to: '/oneshot',
    title: 'Oneshot',
    text: 'Storie che cominciano e finiscono nello stesso evento, spesso con un’ambientazione tutta loro.',
    image: '/oneshot/palazzo-destini/video-poster.jpg',
    cta: 'Guarda le oneshot',
  },
]

const { siteUrl } = useRuntimeConfig().public
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: ASSOCIATION.name,
        url: siteUrl,
        logo: `${siteUrl}/logos/logo_blu.png`,
        taxID: ASSOCIATION.taxCode,
        address: {
          '@type': 'PostalAddress',
          streetAddress: ASSOCIATION.street,
          postalCode: ASSOCIATION.postalCode,
          addressLocality: ASSOCIATION.city,
          addressRegion: ASSOCIATION.province,
          addressCountry: 'IT',
        },
        sameAs: [INSTAGRAM.href],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <!-- The first thing a stranger sees is real people playing: the text sits low, under the action -->
    <section
      class="on-dark relative isolate flex min-h-[min(100svh,880px)] items-end overflow-hidden bg-ink-deep text-on-dark"
    >
      <SiteImage
        src="/immagini/origini_1.jpg"
        alt="Giocatori in costume si fronteggiano con le armi in lattice durante un evento FulcronGRV"
        loading="eager"
        fetchpriority="high"
        class="absolute inset-x-0 top-0 -z-20 h-[58%] w-full object-cover object-[30%_30%] md:h-full md:object-[50%_22%]"
      />
      <div
        class="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-ink-deep)_42%,rgb(0_26_38/0.55)_58%,rgb(0_26_38/0.05)_78%,rgb(0_26_38/0.45)_100%)] md:bg-[linear-gradient(to_top,var(--color-ink-deep)_8%,rgb(0_26_38/0.82)_38%,rgb(0_26_38/0.12)_68%,rgb(0_26_38/0.5)_100%)] lg:bg-[linear-gradient(to_right,rgb(0_26_38/0.6),transparent_62%),linear-gradient(to_top,var(--color-ink-deep)_8%,rgb(0_26_38/0.82)_38%,rgb(0_26_38/0.12)_68%,rgb(0_26_38/0.5)_100%)]"
        aria-hidden="true"
      />
      <div class="container-site pt-[calc(var(--spacing-header)+3rem)] pb-[clamp(6rem,13vw,8.5rem)]">
        <div class="max-w-3xl">
          <h1 class="mb-[0.35em] text-[clamp(2.3rem,6.2vw,4.5rem)] text-white [text-shadow:0_4px_30px_rgb(0_0_0/0.5)]">
            Gioco di ruolo dal vivo nell’Anello di Fulcron
          </h1>
          <p class="max-w-[42ch] text-[clamp(1.1rem,2.2vw,1.3rem)]">
            In costume interpreti il tuo personaggio, insieme agli altri giocatori, sull’Appennino Tosco-Emiliano.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <UiButton to="/inizia-a-giocare" variant="gold" icon-right="arrow-right">Inizia a giocare</UiButton>
            <UiButton to="/sinfonia/ambientazione#la-geografia-di-fulcron" variant="ghost">Guarda la mappa</UiButton>
          </div>
        </div>
      </div>
    </section>

    <section class="container-site relative z-10 -mt-[clamp(3rem,7vw,5rem)]">
      <NextEvent />
    </section>

    <section class="pt-[clamp(3rem,8vw,5.5rem)] pb-[clamp(3rem,8vw,5.5rem)]">
      <UiSectionTitle v-reveal title="Siamo FulcronGRV" class="container-site">
        <p class="mx-auto max-w-[46ch] text-[clamp(1.1rem,2vw,1.25rem)] text-muted">
          Salve, viandante. Siamo un gruppo di amici con la passione per i mondi fantastici e la voglia di viverli in
          prima persona. Così ne abbiamo costruito uno e ci siamo messi a giocarci dentro, nei boschi dell’Appennino
          Tosco-Emiliano.
        </p>
      </UiSectionTitle>
    </section>

    <!-- The world itself, not a card about it -->
    <section class="on-dark bg-ink-deep text-on-dark">
      <div
        v-reveal
        class="container-site grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
      >
        <NuxtLink
          to="/sinfonia/ambientazione#la-geografia-di-fulcron"
          class="group -mt-[clamp(1.5rem,4vw,3.5rem)] block overflow-hidden rounded-card shadow-card-lg ring-1 ring-gold-soft/30 lg:-mb-[clamp(1.5rem,4vw,3.5rem)]"
        >
          <SiteImage
            src="/mappa-fulcron.jpg"
            alt="Mappa di Fulcron: l’Anello di terre attorno al Mare Interno. Guarda la mappa"
            sizes="sm:100vw md:100vw lg:640px"
            class="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </NuxtLink>
        <div class="pb-[clamp(3rem,8vw,5.5rem)] lg:py-[clamp(3rem,8vw,5.5rem)]">
          <h2 class="mb-4 text-[clamp(1.8rem,3.6vw,2.6rem)] text-white">La Sinfonia dei Sette</h2>
          <p class="mb-3 max-w-[46ch]">
            Ghiacci senza fine a Nord, deserti a Est, paludi a Sud, montagne altissime a Ovest e un grande mare interno
            al centro: è l’Anello, il mondo che abbiamo scritto noi.
          </p>
          <p class="mb-6 max-w-[46ch] text-on-dark-muted">
            La Sinfonia dei Sette è la campagna che ci giochiamo dentro da anni. Quello che fanno i personaggi cambia
            davvero come vanno le cose.
          </p>
          <UiButton to="/sinfonia" variant="ghost" icon-right="arrow-right">Scopri la campagna</UiButton>
        </div>
      </div>
    </section>

    <section class="py-[clamp(4rem,9vw,6.5rem)]">
      <div class="container-site grid gap-[clamp(1rem,2.5vw,1.75rem)] md:grid-cols-2">
        <UiCard
          v-for="(item, i) in paths"
          :key="item.to"
          v-reveal="i * 120"
          :to="item.to"
          :image="item.image"
          image-sizes="sm:100vw md:50vw lg:580px"
        >
          <h2 class="mb-1 font-heading text-[1.6rem] tracking-normal">{{ item.title }}</h2>
          <p class="text-muted">{{ item.text }}</p>
          <span
            class="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.92rem] font-semibold text-teal group-hover:text-forest"
          >
            {{ item.cta }} <AppIcon name="arrow-right" :size="16" />
          </span>
        </UiCard>
      </div>
    </section>

    <section
      class="bg-[radial-gradient(ellipse_at_top_right,rgb(184_145_63/0.18),transparent_55%),linear-gradient(135deg,var(--color-ink-deep),var(--color-ink)_55%,var(--color-forest))] py-[clamp(3rem,8vw,5.5rem)] text-on-dark on-dark"
    >
      <div v-reveal class="container-site grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 class="mb-4 text-[clamp(1.6rem,3.2vw,2.3rem)] text-white">Restiamo in contatto</h2>
          <p>
            Date, iscrizioni e novità le pubblichiamo su Instagram. Se hai una domanda, scrivici lì in privato:
            rispondiamo volentieri.
          </p>
        </div>
        <div class="lg:justify-self-end">
          <UiButton :href="INSTAGRAM.href" variant="ghost" icon="instagram"
            >Instagram · {{ INSTAGRAM.handle }}</UiButton
          >
        </div>
      </div>
    </section>
  </div>
</template>
