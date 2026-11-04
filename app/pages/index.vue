<script setup lang="ts">
useSeoMeta({ title: 'FulcronGRV', ogTitle: 'FulcronGRV · Gioco di ruolo dal vivo' })

const features = [
  {
    to: '/sinfonia',
    eyebrow: 'La campagna',
    title: 'La Sinfonia dei Sette',
    text: 'Fulcron, l’Anello: un mondo inventato da noi, con i suoi regni, i suoi dei e la sua storia. Quello che fanno i personaggi cambia davvero come vanno le cose.',
    image: '/immagini/origini_2.jpg',
  },
  {
    to: '/oneshot',
    eyebrow: 'Avventure singole',
    title: 'Oneshot',
    text: 'Storie che cominciano e finiscono nello stesso evento, ognuna con un’ambientazione tutta sua.',
    image: '/oneshots/TearAsunder.jpg',
  },
  {
    to: '/inizia-a-giocare',
    eyebrow: 'Prima volta?',
    title: 'Inizia a giocare',
    text: 'Cosa serve, come si crea un personaggio, come funzionano i combattimenti: le risposte alle domande che ci fate più spesso.',
    image: '/albums/banchettodeiguitti.jpg',
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
    <section class="on-dark relative isolate grid min-h-[min(100svh,900px)] place-items-center overflow-hidden text-on-dark">
      <SiteImage
        src="/backgrounds/forest_op_comp.jpg"
        loading="eager"
        fetchpriority="high"
        class="absolute inset-0 -z-20 size-full object-cover"
      />
      <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(0_26_38/0.35),rgb(0_26_38/0.8)_75%),linear-gradient(180deg,rgb(0_26_38/0.7)_0%,rgb(0_64_19/0.25)_45%,rgb(0_26_38/0.95)_100%)]"
        aria-hidden="true"
      />
      <div class="container-site flex flex-col items-center pt-[calc(var(--spacing-header)+3rem)] pb-20 text-center">
        <img
          src="/logos/logo_bianco.png"
          alt=""
          width="220"
          height="220"
          class="mb-6 w-[clamp(130px,22vw,220px)] animate-turn drop-shadow-[0_6px_24px_rgb(0_0_0/0.5)]"
        />
        <span class="eyebrow text-gold-soft [text-shadow:0_1px_12px_rgb(0_26_38/0.8)]">Associazione di gioco di ruolo dal vivo</span>
        <h1 class="mb-[0.3em] text-[clamp(2.6rem,7vw,5rem)] text-white [text-shadow:0_4px_30px_rgb(0_0_0/0.5)]">
          Benvenuto a Fulcron
        </h1>
        <p class="max-w-[40ch] text-[clamp(1.1rem,2.4vw,1.35rem)]">
          Vivi la tua avventura, ora. Scopri le magiche e vive terre dell’Anello.
        </p>
        <div class="mt-4 flex flex-wrap justify-center gap-3">
          <UiButton to="/inizia-a-giocare" variant="gold" icon-right="arrow-right">Inizia a giocare</UiButton>
          <UiButton to="/sinfonia/ambientazione" variant="ghost">Scopri Fulcron</UiButton>
        </div>
      </div>
    </section>

    <section class="container-site -mt-[clamp(2rem,5vw,3.5rem)] relative z-10">
      <NextEvent />
    </section>

    <section class="pt-[clamp(3rem,8vw,5.5rem)] pb-4">
      <UiSectionTitle v-reveal eyebrow="Salve, viandante" title="Siamo FulcronGRV" class="container-site">
        <p class="mx-auto max-w-[60ch] text-[clamp(1.1rem,2vw,1.25rem)] text-muted">
          Un gruppo di amici con la passione per i mondi fantastici e la voglia di viverli in prima persona. Così ne
          abbiamo costruito uno e ci siamo messi a giocarci dentro, nei boschi dell’Appennino Tosco-Emiliano. Da lì sono
          nate una campagna che va avanti da anni, La Sinfonia dei Sette, e una serie di oneshot.
        </p>
      </UiSectionTitle>
    </section>

    <section class="py-[clamp(3rem,8vw,5.5rem)]">
      <div class="container-site grid gap-[clamp(1rem,2.5vw,1.75rem)] md:grid-cols-3">
        <UiCard
          v-for="(f, i) in features"
          :key="f.to"
          v-reveal="i * 120"
          :to="f.to"
          :image="f.image"
          image-sizes="sm:100vw md:33vw lg:400px"
        >
          <span class="eyebrow mb-1.5">{{ f.eyebrow }}</span>
          <h3 class="mb-1 text-[1.45rem]">{{ f.title }}</h3>
          <p class="text-muted">{{ f.text }}</p>
          <span
            class="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.92rem] font-semibold text-teal group-hover:text-forest"
          >
            Scopri di più <AppIcon name="arrow-right" :size="16" />
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
          <UiButton :href="INSTAGRAM.href" variant="ghost" icon="instagram">Instagram · {{ INSTAGRAM.handle }}</UiButton>
        </div>
      </div>
    </section>
  </div>
</template>
