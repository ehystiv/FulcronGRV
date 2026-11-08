<script setup lang="ts">
useSeoMeta({ title: 'FulcronGRV', ogTitle: 'FulcronGRV · Gioco di ruolo dal vivo' })

// The texts live in content/home.yml
const { data: home } = await useAsyncData('home', () => queryCollection('home').first())
if (!home.value) throw createError({ statusCode: 500, statusMessage: 'Manca content/home.yml', fatal: true })
const { hero, intro, campaign, paths, question } = home.value

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
        :src="hero.image"
        :alt="hero.imageAlt"
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
          <h1 class="mb-[0.35em] text-display text-white [text-shadow:0_4px_30px_rgb(0_0_0/0.5)]">
            {{ hero.title }}
          </h1>
          <p class="max-w-[42ch] text-[clamp(1.1rem,2.2vw,1.3rem)]">{{ hero.text }}</p>
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

    <section class="pt-section pb-section">
      <UiSectionTitle v-reveal :title="intro.title" class="container-site">
        <p class="mx-auto max-w-[46ch] text-lead text-muted">{{ intro.text }}</p>
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
        <div class="pb-section lg:py-section">
          <h2 class="mb-4 text-[clamp(1.8rem,3.6vw,2.6rem)] text-white">{{ campaign.title }}</h2>
          <p class="mb-3 max-w-[46ch]">{{ campaign.text }}</p>
          <p v-if="campaign.note" class="mb-6 max-w-[46ch] text-on-dark-muted">{{ campaign.note }}</p>
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
      class="bg-[radial-gradient(ellipse_at_top_right,rgb(184_145_63/0.18),transparent_55%),linear-gradient(135deg,var(--color-ink-deep),var(--color-ink)_55%,var(--color-forest))] py-section text-on-dark on-dark"
    >
      <div v-reveal class="container-site grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 class="mb-4 text-heading text-white">{{ question.title }}</h2>
          <p>{{ question.text }}</p>
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
