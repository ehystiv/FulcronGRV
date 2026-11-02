<script setup lang="ts">
useHead({ title: 'Chi siamo' })
useSeoMeta({
  description:
    'FulcronGRV è un’associazione di gioco di ruolo dal vivo nata tra i boschi dell’Appennino Tosco-Emiliano. Scopri le nostre origini e la campagna La Sinfonia dei Sette.',
})
</script>

<template>
  <div>
    <section class="banner">
      <SiteImage
        src="/immagini/origini_1.jpg"
        alt="Giocatori in costume durante un evento FulcronGRV"
        loading="eager"
      />
      <div class="banner-text container">
        <span class="eyebrow">Chi siamo</span>
        <h1>Le nostre origini</h1>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <p class="lead"><strong>Salve, viandante.</strong></p>
        <p>
          FulcronGRV è un’associazione di gioco di ruolo dal vivo. All’inizio eravamo un gruppo di amici con la passione
          per i mondi fantastici e la voglia di viverli in prima persona. Abbiamo cominciato nei boschi dell’Appennino
          Tosco-Emiliano e da lì non ci siamo più fermati.
        </p>
        <p>
          Il mondo in cui giochiamo si chiama Fulcron, o l’Anello, come lo chiamano in molti. Geografia, storia e
          mitologia le abbiamo scritte noi, prendendo ispirazione da epoche e culture molto diverse: il medioevo
          europeo, la Grecia classica, le giungle dell’America centrale, il mondo arabo, il Giappone dell’epoca Edo.
        </p>
        <p>
          Oltre alla campagna principale organizziamo anche <NuxtLink to="/oneshot">oneshot</NuxtLink>, storie
          autoconclusive con ambientazioni tutte loro, come Tear Asunder, Sunless Dawn o La Teoria del Nulla.
        </p>
      </div>
    </section>

    <section class="banner">
      <SiteImage src="/immagini/origini_2.jpg" alt="Scena di gioco della campagna La Sinfonia dei Sette" />
      <div class="banner-text container align-end">
        <span class="eyebrow">La campagna</span>
        <h2>La Sinfonia dei Sette</h2>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <p>
          La Sinfonia dei Sette è la nostra campagna: da diversi anni segue un gruppo di avventurieri che cerca di
          sopravvivere nell’Anello. Le terre di Fulcron sono chiuse da grandi barriere naturali: ghiacci senza fine a
          Nord, deserti a Est, paludi a Sud e montagne altissime a Ovest. Al centro c’è un grande mare interno, ed è da
          lì che viene il nome.
        </p>
        <p>
          È una campagna fantasy, ma ci teniamo che il mondo sia coerente e che reagisca a quello che fanno i giocatori.
          In un evento ci sono battaglie, ma anche intrighi, trattative e preghiere. Magia e combattimento seguono un
          <NuxtLink to="/sinfonia/regolamento">regolamento</NuxtLink> a livelli: chi arriva per la prima volta impara le
          basi in fretta, chi gioca da anni ha sempre qualcosa da far crescere.
        </p>
        <p>
          Negli anni i personaggi si sono imbattuti in segreti perduti e misteri che nessuno aveva risolto. In uno dei
          capitoli della campagna, per esempio, si sono trovati contro un antico Signore Vampiro. Sconfitti più volte da
          lui e dalle creature create secoli prima da un uomo potente quasi quanto gli dei, hanno seguito una strada
          tracciata da una dea con lacrime e sangue. In fondo a quella strada, nel vampiro che temevano, hanno trovato
          un uomo diviso tra l’oscurità che gli era stata instillata e la luce che non lo aveva mai lasciato.
        </p>
        <p>
          Alcuni sono caduti, altri si sono salvati. Poi, quando anche quell’Ultima Lacrima ha toccato il suolo, gli
          avventurieri si sono rimessi in marcia, tra vecchie profezie e storie nuove.
        </p>

        <blockquote v-reveal class="closing">
          Fulcron può essere una terra inospitale, a volte crudele e infame, ma sa ricompensare ampiamente chiunque
          abbia il coraggio di avventurarcisi: è un mondo vivo, che non riposa mai e avrà sempre storie nuove da
          raccontare per chi avrà l’audacia di ascoltarle.
        </blockquote>

        <div class="btn-row cta">
          <NuxtLink to="/sinfonia/ambientazione" class="btn btn-primary">Scopri l’ambientazione</NuxtLink>
          <NuxtLink to="/sinfonia/regolamento" class="btn btn-outline">Leggi il regolamento</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  height: clamp(260px, 45vw, 480px);
  overflow: hidden;
  color: #fff;
  isolation: isolate;
}
.banner :deep(img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
.banner::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgb(0 26 38 / 0.15) 30%, rgb(0 26 38 / 0.85));
}
.banner-text {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: clamp(1.5rem, 4vw, 3rem);
}
.banner-text.align-end {
  align-items: flex-end;
  text-align: right;
}
.banner h1,
.banner h2 {
  color: #fff;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  margin: 0;
  text-shadow: 0 2px 20px rgb(0 0 0 / 0.5);
}
.banner .eyebrow {
  color: var(--gold-soft);
}
.closing {
  margin-block: 2.5rem;
  font-family: var(--font-display);
  font-style: normal;
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--ink);
}
.cta {
  justify-content: center;
}
</style>
