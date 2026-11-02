<script setup lang="ts">
useHead({ title: 'Regolamento' })
useSeoMeta({
  description:
    'Le regole base del gioco di ruolo dal vivo FulcronGRV: correttezza, sicurezza, In Gioco e Fuori Gioco, PG, PNG e PGOS, PAB e i manuali da scaricare.',
})

const documents = [
  { href: '/documents/guida-eventi.pdf', title: 'Guida agli eventi', size: '16 MB' },
  { href: '/documents/manuale-abilita.pdf', title: 'Manuale delle abilità', size: '4 MB' },
  { href: '/documents/guida-magia.pdf', title: 'Guida alla magia', size: '2,7 MB' },
]
</script>

<template>
  <div class="container section">
    <div class="prose">
      <h1>Regolamento</h1>
      <p class="lead">Regole basilari per ogni tipo di LARP (gioco di ruolo dal vivo).</p>

      <section class="rule">
        <h2>Correttezza e rispetto verso gli altri</h2>
        <p>Giochiamo per divertirci, ma la libertà di un Giocatore non deve limitare quella degli altri.</p>
        <p>
          Durante gli Eventi, lo Staff, a proprio insindacabile giudizio, allontanerà chiunque commetta azioni
          pericolose per se stesso o per altri, chiunque assuma atteggiamenti offensivi o aggressivi fuori dal gioco e
          chiunque, per questi o altri motivi, impedisca ad altri Giocatori di divertirsi.
        </p>
      </section>

      <section class="rule">
        <h2>Onestà</h2>
        <p>Sono molte le situazioni in cui il Giocatore potrebbe “barare” a vantaggio del Personaggio.</p>
        <p>
          Farlo non apporta nessun reale beneficio al Giocatore, dato che nel nostro gioco non si “vince” nel senso
          tradizionale del termine, ma rappresenta una grave mancanza di rispetto verso gli altri Giocatori. Violare
          questa linea guida può comportare conseguenze molto gravi per il PG interpretato dal Socio (per esempio essere
          soggetto alla chiamata “<strong>IMPERIUM muori</strong>”) e sanzioni per il Socio stesso. A mero titolo di
          esempio:
        </p>
        <ul>
          <li>non è lecito utilizzare informazioni acquisite Fuori Gioco;</li>
          <li>
            non è lecito divulgare informazioni acquisite correttamente mentre il Personaggio del Giocatore non sarebbe
            in grado di fornirle (perché il PG è imprigionato o morto, per esempio), nemmeno sotto forma di diari o
            scritti “postumi” del PG che contengano informazioni di Gioco;
          </li>
          <li>
            non è lecito, per evitare situazioni equivoche, che un Giocatore faccia in modo che i suoi Personaggi siano
            legati da un rapporto di qualunque natura.
          </li>
        </ul>
        <p class="notice">Un comportamento palesemente scorretto deve essere segnalato e conseguentemente punito.</p>
      </section>

      <section class="rule">
        <h2>Sicurezza</h2>
        <p>
          In nessun caso il Giocatore può agire in modo da mettere a rischio la propria incolumità o quella di altri.
        </p>
        <p>
          I Giocatori non sono autorizzati ad agire a proprio rischio neppure sotto la propria responsabilità.
          Atteggiamenti rischiosi o pericolosi sono puniti con l’immediato allontanamento dall’Evento, cui potranno
          seguire gravi provvedimenti e persino l’espulsione.
        </p>
      </section>

      <section class="rule">
        <h2>Differenza fra “In Gioco” e “Fuori Gioco”</h2>
        <p>
          Nella dinamica di un gioco di ruolo dal vivo, il Personaggio e il Giocatore non vanno identificati. In
          particolare, le azioni della persona reale (il Giocatore) influenzano quelle del personaggio immaginario (il
          Personaggio) in modi che devono essere regolamentati, per evitare equivoci.
        </p>
        <ul>
          <li>per le azioni di Gioco si usa il termine <strong>In Gioco (IG)</strong>;</li>
          <li>per azioni non legate alle dinamiche di gioco si usa il termine <strong>Fuori Gioco (FG)</strong>.</li>
        </ul>
        <p>
          È essenziale saper distinguere le cose In Gioco da quelle Fuori Gioco e agire di conseguenza, a partire dalle
          cose più semplici.
        </p>
        <div class="examples">
          <div class="example bad">
            <span class="label">Da evitare</span>
            <blockquote>“Quel PNG ha 3 PF e non dichiara nulla di strano: possiamo farcela!”</blockquote>
            <blockquote>“Ci serve un’arma che dichiari HOLY.”</blockquote>
          </div>
          <div class="example good">
            <span class="label">Molto meglio</span>
            <blockquote>
              “Ho visto combattere quell’Orco, non è robusto come si dice e le sue armi paiono di pessima fattura: è
              nostro!”
            </blockquote>
            <blockquote>“Abbiamo bisogno di una spada sacra.”</blockquote>
          </div>
        </div>
      </section>

      <section class="rule">
        <h2>PG, PNG e PGOS: tre modi di giocare</h2>
        <p>
          Se sei nel mondo del gioco di ruolo dal vivo da un po’, saprai già cosa significa essere PG o PNG, ma di
          sicuro non conosci i PGOS.
        </p>
        <dl class="roles">
          <dt>PG · Personaggio Giocante</dt>
          <dd>
            È il proprio personaggio, creato da zero: puoi sceglierne background, abilità, obiettivi e caratteristiche,
            grazie ai PAB (Punti Abilità) ottenibili giocando.
          </dd>
          <dt>PNG · Personaggio Non Giocante</dt>
          <dd>
            È creato dai registi con l’obiettivo di creare gioco e ambientazione: riceve precise indicazioni su cosa
            dovrà fare durante la giornata di gioco.
          </dd>
          <dt>PGOS · Personaggio Giocante da One Shot</dt>
          <dd>
            La vera novità. Non farti impressionare dal nome lungo: sono personaggi creati dalla regia per rendere
            ancora più vivo il mondo di gioco. A differenza dei PNG, giocano come qualsiasi altro personaggio, con
            background, obiettivi, caratteristiche e talvolta abilità. Inoltre, proprio come succede con i PG, non sanno
            nulla della trama e degli avvenimenti dell’evento, cosa che invece facilita il lavoro del PNG.
          </dd>
        </dl>
      </section>

      <section class="rule">
        <h2>I PAB, la moneta di scambio</h2>
        <p>
          Se pensi di volere un PG per muoverti nel mondo di Fulcron, allora sarai assolutamente interessato ai PAB. I
          PAB (Punti Abilità) sono la moneta che ti permette di migliorare il tuo personaggio e di svilupparlo come
          meglio credi: ogni giocatore ha a disposizione fin dall’inizio 130 PAB per ogni personaggio, che gli
          permettono di modellarlo in maniera ben definita.
        </p>
        <p>
          Per ogni giornata a cui partecipi, qualunque sia il tuo ruolo, guadagni almeno 10 PAB; aiutando a sistemare
          dopo gli eventi, in cucina e così via potrai guadagnarne altri e far crescere il tuo personaggio più
          velocemente!
        </p>
      </section>

      <section class="rule">
        <h2>Il nostro regolamento</h2>
        <p>
          Il nostro regolamento prevede l’utilizzo di armi in lattice e l’apprendimento di alcune semplici regole che
          indicano magie, effetti o colpi all’interno del gioco, in modo da integrare in maniera ottimale la magia e le
          abilità particolari.
        </p>
        <p>Per questo abbiamo dei veri e propri manuali, comodamente scaricabili qui.</p>
        <ul class="docs">
          <li v-for="doc in documents" :key="doc.href">
            <a :href="doc.href" target="_blank" rel="noopener" class="doc">
              <AppIcon name="file" :size="28" />
              <span>
                <strong>{{ doc.title }}</strong>
                <span class="muted">PDF · {{ doc.size }}</span>
              </span>
              <AppIcon name="download" :size="20" class="doc-dl" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rule {
  padding-top: 2.5rem;
  margin-top: 2.5rem;
  border-top: 1px solid var(--border);
}
.notice {
  padding: 0.9rem 1.2rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--gold) 14%, transparent);
  font-weight: 500;
}
.examples {
  display: grid;
  gap: 1rem;
}
@media (min-width: 700px) {
  .examples {
    grid-template-columns: 1fr 1fr;
  }
}
.example {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
}
.example blockquote {
  margin: 0.6rem 0 0;
  background: transparent;
  padding: 0.25rem 0 0.25rem 0.9rem;
}
.example .label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.bad .label {
  color: #9b2c2c;
}
.bad blockquote {
  border-left-color: #c26b6b;
}
.good .label {
  color: var(--forest);
}
.good blockquote {
  border-left-color: var(--forest);
}
.roles dt {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--ink);
  margin-top: 1.25rem;
}
.roles dd {
  margin: 0.25rem 0 0;
}
.docs {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.doc {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--ink);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.doc:hover {
  border-color: var(--gold);
  box-shadow: var(--shadow);
}
.doc > span {
  display: flex;
  flex-direction: column;
  flex: 1;
  line-height: 1.4;
}
.doc .muted {
  font-size: 0.85rem;
}
.doc-dl {
  color: var(--gold);
}
</style>
