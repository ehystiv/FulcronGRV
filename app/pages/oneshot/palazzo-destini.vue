<script setup lang="ts">
useHead({ title: 'Il Palazzo dei Destini Incrociati' })
useSeoMeta({
  description:
    'Il Palazzo dei Destini Incrociati: oneshot di gioco di ruolo dal vivo di FulcronGRV. Guida all’evento, teaser PGOS e iscrizioni.',
  ogImage: '/immagini/palazzo-destini.jpg',
})
</script>

<template>
  <div>
    <PageHero eyebrow="Oneshot" title="Il Palazzo dei Destini Incrociati">
      <div class="btn-row actions">
        <a class="btn btn-primary" href="https://forms.gle/LR3FeS2pnCrgXyDi6" target="_blank" rel="noopener"
          >Iscriviti</a
        >
        <a
          class="btn btn-outline"
          href="https://drive.google.com/file/d/1NKhJUhz_0W6bypn5fitew9TB5CySakkd/view?usp=sharing"
          target="_blank"
          rel="noopener"
          >Guida all’evento</a
        >
        <a
          class="btn btn-outline"
          href="https://drive.google.com/file/d/1V10epn3PESgfp0M3SNXookHBXPbNweV_/view?usp=sharing"
          target="_blank"
          rel="noopener"
          >Teaser PGOS</a
        >
      </div>
    </PageHero>

    <div class="container section layout">
      <div class="story">
        <p>Scorre, il filo del fato. Veloce si dipana dalla matassa.</p>
        <p>Corre attraverso i segreti del Tempo, mentre il Caso ridendo lo accompagna.</p>
        <p>Insieme, formano quella cosa che noi mortali chiamiamo Destino.</p>
        <p>
          Se tu potessi vederlo, tu che posi gli occhi su queste righe, assisteresti a uno spettacolo unico: decine di
          fili cangianti che si uniscono in un unico punto.
        </p>
        <p class="accent">La Magione de Van Gaussié.</p>
        <p>
          Qualcuno ancora nemmeno immagina che questa sia la destinazione cui è destinato, mentre altri già godono
          dell’ospitalità del padrone di casa, Tremelech de Van Gaussié.
        </p>
        <p>Ah, il magnifico ospite.</p>
        <p>
          Molti hanno sentito parlare di lui, pochi lo hanno visto, nessuno può dire di conoscerlo. Sempre così
          elegante, così generoso nell’accogliere i viandanti.
        </p>
        <p>
          Un esteta. Un genio. Un folle? Non lo sai. Come non sai chi governi su queste terre di frontiera. Come non sai
          chi altro verrà condotto dal Destino questa sera qui, in questa villa, a questo banchetto.
        </p>
        <p>
          Forse, è ora che prepari la tua storia, caro lettore. D’altronde, cosa siamo noi se non quello che diciamo di
          essere? Diventiamo ciò che gli altri vedono quando ci guardano, dopotutto.
        </p>
        <p>Forse, questa sera sarà più necessaria che mai una maschera.</p>
        <p>Indossala, caro lettore, e benvenuto.</p>
        <p class="accent">Benvenuto nel Palazzo dei Destini Incrociati.</p>
      </div>

      <figure v-reveal class="poster">
        <SiteImage
          src="/immagini/palazzo-destini.jpg"
          alt="Locandina dell’evento Il Palazzo dei Destini Incrociati"
          sizes="sm:100vw md:100vw lg:520px"
        />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.actions {
  justify-content: center;
  margin-top: 1.5rem;
}
.layout {
  display: grid;
  gap: 3rem;
  align-items: start;
}
@media (min-width: 960px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  }
  .poster {
    position: sticky;
    top: calc(var(--header-h) + 2rem);
  }
}
.story {
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.85;
  max-width: 60ch;
}
.story .accent {
  font-family: var(--font-display);
  font-style: normal;
  font-size: 1.35rem;
  color: var(--ink);
}
.poster {
  margin: 0;
}
.poster :deep(img) {
  width: 100%;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}
</style>
