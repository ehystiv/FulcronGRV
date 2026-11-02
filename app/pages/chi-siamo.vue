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
      <img src="/immagini/origini_1.jpg" alt="Giocatori in costume durante un evento FulcronGRV" />
      <div class="banner-text container">
        <span class="eyebrow">Chi siamo</span>
        <h1>Le nostre origini</h1>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <p class="lead"><strong>Salve, viandante.</strong></p>
        <p>
          FulcronGRV è un’associazione di gioco di ruolo dal vivo nata da un gruppo di amici e dalla loro voglia di
          vivere in mondi fantastici. Tra i boschi dell’Appennino Tosco-Emiliano, questa voglia ha continuato a
          spingerci anche fin dove non avremmo mai pensato.
        </p>
        <p>
          Durante lo svolgersi della campagna, grandi guerre, conquiste e rivoluzioni hanno segnato ogni landa di
          Fulcron, l’Anello, come lo chiamano in molti.
        </p>
        <p>
          Fulcron è il mondo teatro delle nostre avventure. La sua geografia, la sua storia, la sua mitologia sono
          originali, ispirate a periodi storici e culture differenti come ad esempio il medioevo europeo, la cultura
          classica greca, le giungle dell’America centrale, la cultura araba e quella giapponese dell’epoca Edo.
        </p>
        <p>
          La nostra associazione organizza da tempo una campagna continuativa, ma realizza anche
          <NuxtLink to="/oneshot">oneshot</NuxtLink> con temi e ambientazioni diverse, come ad esempio Tear Asunder,
          Sunless Dawn o La Teoria del Nulla.
        </p>
      </div>
    </section>

    <section class="banner">
      <img src="/immagini/origini_2.jpg" alt="Scena di gioco della campagna La Sinfonia dei Sette" loading="lazy" />
      <div class="banner-text container align-end">
        <span class="eyebrow">La campagna</span>
        <h2>La Sinfonia dei Sette</h2>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <p>
          La campagna Fulcron segue da diversi anni le gesta di un gruppo di avventurieri, impegnati a sopravvivere
          nell’Anello, il mondo fantastico e originale in cui prendono vita le nostre avventure.
        </p>
        <p>
          Le terre di Fulcron sono intrappolate tra grandi barriere naturali: lande ghiacciate senza fine a Nord,
          deserti sconfinati a Est, paludi malsane a Sud e alte montagne a Ovest. Un grande mare sorge all’interno di
          Fulcron, rendendolo così noto come l’Anello tra la gente comune.
        </p>
        <p>
          La campagna è a tema fantasy e riunisce al suo interno diversi spunti, amalgamati per creare un mondo coerente
          e vivo che risponde alle azioni dei giocatori. Cerchiamo di proporre eventi equilibrati, in cui si alternano
          momenti di conflitto, intrighi, preghiere e diplomazia. La magia e il combattimento sono gestiti da un
          <NuxtLink to="/sinfonia/regolamento">regolamento</NuxtLink> stratificato, che permette ai nuovi entrati di
          comprendere in fretta le basi per giocare ma che dona un buon senso di progressione ai veterani della
          campagna.
        </p>
        <p>
          Per volere di un destino che va al di là della cognizione dei mortali stessi, i protagonisti della campagna si
          sono imbattuti in segreti perduti e misteri irrisolti a cui hanno cercato di dare risposta.
        </p>
        <p>
          Tanti sono gli interrogativi sul passato di Fulcron, i suoi celati giochi di potere e le gesta dei suoi figli.
          In particolare, l’ultimo anno di campagna ha visto i giocatori impegnati nella lotta contro un grande e antico
          Signore Vampiro. Più volte messi in scacco e sconfitti da queste oscure creature, create secoli fa da un uomo
          il cui potere sfiorava quello degli dei, i personaggi hanno seguito un percorso tracciato molto tempo prima.
          Una strada lastricata da una dea con lacrime e sangue, che li ha condotti fino a trovare, nel vampiro che
          temevano, un uomo sospeso tra l’oscurità in lui instillata e la luce che in lui aveva sempre albergato.
        </p>
        <p>
          Alcuni sono caduti, altri si sono salvati, ma dopo che anche questa Ultima Lacrima ha toccato il suolo, gli
          avventurieri hanno ricominciato la loro marcia, tra antiche profezie e nuove storie da raccontare.
        </p>

        <blockquote class="closing">
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
.banner img {
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
