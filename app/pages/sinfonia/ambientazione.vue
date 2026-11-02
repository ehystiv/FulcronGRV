<script setup lang="ts">
useHead({ title: 'Ambientazione' })
useSeoMeta({
  description:
    'Fulcron, l’Anello: la geografia, la politica, le razze, le religioni e la storia del mondo fantasy della campagna La Sinfonia dei Sette.',
})

const sections = [
  { id: 'cos-e-fulcron', label: 'Cos’è Fulcron?' },
  { id: 'geografia', label: 'Geografia' },
  { id: 'politica', label: 'Politica' },
  { id: 'razze', label: 'Razze' },
  { id: 'religioni', label: 'Religioni' },
  { id: 'storia', label: 'Storia' },
  { id: 'wiki', label: 'La Wiki' },
]

const regions = [
  {
    name: 'Il Nord',
    text: 'Ispirato all’Europa del basso medioevo, è composto da una grande varietà di regni. Tra i più significativi ricordiamo il Regno di Ilshaka, retto dal grande sovrano guerriero Nymbra Shoot, un re ormai molto anziano che fu decisivo nel mantenere il Nord unito in molte delle guerre del passato, e Lungacosta, regno affacciato sul mare governato da una regina ambiziosa, Elaine Moonsharp.',
  },
  {
    name: 'L’Est',
    text: 'Ispirato alle grandi civiltà asiatiche e nordafricane, l’Est è suddiviso in tre grandi regioni. Verso nord troviamo le Città Libere del Deserto, che si governano in autonomia. Tra di esse spicca Partaros, da cui si è originato il grande e potente Ordine dei Guaritori. Nelle Terre Verdi di Jotai sorge invece l’Impero dei Dodici Fiori, attualmente governato dall’autoproclamatosi imperatore Doran. Infine, il sultanato degli Arak, composto da nomadi del deserto governati da un ricco e potente sultano.',
  },
  {
    name: 'Il Sud',
    text: 'Ispirato alla cultura greca e romana del mondo classico. Una grande muraglia si estendeva lungo tutto il confine meridionale del regno e lo separava dai Diaforos, creature orribili e bellicose. Qualche anno fa il muro è crollato, stravolgendo ogni equilibrio geopolitico della zona. Attualmente il Sud è frammentato e diviso: l’Antico Regno cerca di resistere, mentre una nuova entità territoriale, Nea Imera, è sorta con la speranza di unire uomini e Diaforos. Intere regioni sono perdute nell’anarchia e nel disordine, mentre nelle Tre Gemme del Sud, ricche città di traffici e commerci, i mercanti hanno approfittato della situazione per prendere il potere.',
  },
  {
    name: 'L’Ovest',
    text: 'Ispirato alle Americhe precolombiane. Grandi foreste vergini si estendono per tutto il territorio e le grandi potenze di Fulcron competono per colonizzare la zona. Grandi tribù di guerrieri nomadi vivono in queste terre.',
  },
  {
    name: 'Il Mare Interno',
    text: 'Il grande oceano che si trova al centro di Fulcron e che gli conferisce la caratteristica forma ad Anello. Molti sono i pirati che solcano questi mari, dato che nessun regnante è mai stato abbastanza potente da estendere il suo controllo su di essi.',
  },
]

const races = [
  {
    name: 'Gli Elfi',
    text: 'Dal corpo snello e slanciato, dotati di caratteristiche orecchie appuntite e carnagione chiara. La loro forza risiede nella saggezza e nelle capacità sensoriali elevate.',
  },
  {
    name: 'I Nani',
    text: 'Dal corpo tozzo e per niente slanciato, dotati di folte barbe e particolarmente villosi. La loro forza risiede nella resistenza fisica e nella conoscenza della terra e dell’industria.',
  },
  {
    name: 'I Raktaag',
    text: 'I loro corpi sono ricoperti in parte da scaglie del tutto simili a quelle dei draghi, e per questo sono conosciuti anche come Uomini-Drago.',
  },
  {
    name: 'Gli Uomini con le branchie',
    text: 'Particolarmente affini agli ambienti acquatici. In questo tipo di habitat non hanno rivali.',
  },
  {
    name: 'Gli Uomini-Gatto',
    text: 'I loro corpi presentano i tratti tipici dei felini. La loro forza sta nell’astuzia e nella capacità di adattamento.',
  },
  {
    name: 'I Maut',
    text: 'Il loro corpo nel corso degli anni va incontro a necrosi e deterioramento senza perdere in funzionalità. La loro forza sta proprio nella maggiore resistenza alla malattia e ai danni fisici.',
  },
  {
    name: 'Gli Uomini',
    text: 'Il loro corpo non presenta particolarità molto rilevanti, ma si tratta di una razza molto versatile e diffusa.',
  },
]

const gods = [
  { name: 'Surya', role: 'Dio del sole e della vita' },
  { name: 'Andhera', role: 'Dio della notte e della morte' },
  { name: 'Yud’ah', role: 'Dio della guerra e del fuoco' },
  { name: 'Samudra', role: 'Dea delle acque' },
  { name: 'Hava', role: 'Dea del cielo e dell’aria' },
  { name: 'Samajhadara', role: 'Dea della sapienza' },
  { name: 'Mausama', role: 'Dio del mutamento' },
]

const eras = [
  {
    name: 'Quinta Era',
    events: [
      {
        date: '2000',
        event:
          'Una serie di pietre infuocate cadono su Fulcron causando distruzioni e milioni di vittime. L’evento è ricordato come la Pioggia di Fuoco. Il mondo entra in una fase di profonda crisi e decadenza conosciuta come gli Anni Oscuri.',
      },
      { date: '2001', event: 'Titus Caius uccide il terribile Drago Viola di Mezuna.' },
      {
        date: '2003',
        event: 'Eklitz von Sharr, nobile del Rorish, recluta un’armata per sconfiggere il folle Arnarr Ruu.',
      },
      {
        date: '2197',
        event: 'Su di una grande voragine formata a seguito della Pioggia di Fuoco viene fondata la città di Partaros.',
      },
      {
        date: '2200 ca.',
        event:
          'Hanami della Camelia mette fine alle guerre tra i Dodici Regni di Jotai e fonda l’Impero dei Dodici Fiori.',
      },
      {
        date: '2228',
        event: 'Il “Demone del Deserto”, o Barghest, viene sigillato dai guaritori e dai sacerdoti di Partaros.',
      },
      {
        date: '2230',
        event:
          'I guaritori di Partaros si uniscono alla battaglia contro il folle Arnarr Ruu. Per l’occasione Zaran Azar viene scelto come ambasciatore.',
      },
      { date: '2238', event: 'A Partaros viene fondato l’Ordine dei Guaritori.' },
      { date: '2500 ca.', event: 'Sul fiume Amdinare viene fondata la città di Theris.' },
      {
        date: '2600 ca.',
        event:
          'La città di Partaros estende la sua influenza in gran parte del Grande Deserto, fino a Cyr, creando l’Impero del Sol Levante.',
      },
      { date: '2666', event: 'Vengono accolte a Theris le nobili famiglie Heat e Claymore.' },
      {
        date: '2681',
        event:
          'Battaglia dei Campi di Riso: l’esercito dell’Impero del Sol Levante viene sconfitto da quello di Jotai ed è costretto a ritirarsi verso nord.',
      },
      { date: '2710', event: 'L’Impero del Sol Levante estende la sua influenza fino a Theris.' },
      {
        date: '2712',
        event: 'Ritornano alla luce i primi documenti storici dopo gli Anni Oscuri. Inizia la Grande Guerra.',
      },
      { date: '2812', event: 'Fine della Grande Guerra e morte dell’ultimo Drago per mano di Iulius Caius.' },
      { date: '19 Termidoro 3013', event: 'Scoppia ufficialmente la guerra tra Est e Nord.' },
      {
        date: '20 Termidoro 3014',
        event: 'Nel grande Muro a Sud viene aperta una breccia. I Diaforos dilagano nelle terre settentrionali.',
      },
    ],
  },
  {
    name: 'Sesta Era',
    events: [
      {
        date: '11 Termidoro 3015 · Anno 0 della Sesta Era',
        event:
          'Fulcron viene sconvolta dal Grande Cataclisma. A Nord una grande esplosione devasta tutto lasciando un enorme buco nero. I Draghi tornano improvvisamente ad abitare i cieli di Fulcron.',
      },
      {
        date: '29 Fiorile 3016',
        event: 'La regina dei pirati Elisha MaGkrafun viene assassinata. La M.A.S. attacca Port Imperial.',
      },
      { date: '13 Fruttidoro 3016', event: 'La cupola nera comparsa a Nord si dissolve nel nulla.' },
      { date: '28 Fiorile 3017', event: 'Scoppia la Guerra dell’Occhio, dichiarata dall’Occhio di Hava.' },
      { date: '1 Vendemmiaio 3017', event: 'Conclusione della Guerra dell’Occhio e vittoria dei popoli liberi.' },
    ],
  },
]
</script>

<template>
  <div class="container layout section">
    <aside class="toc" aria-label="Indice">
      <p class="toc-title">In questa pagina</p>
      <ol>
        <li v-for="s in sections" :key="s.id">
          <a :href="`#${s.id}`">{{ s.label }}</a>
        </li>
      </ol>
    </aside>

    <article class="content">
      <h1>Ambientazione</h1>

      <nav class="toc-mobile" aria-label="Indice">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="pill">{{ s.label }}</a>
      </nav>

      <section id="cos-e-fulcron">
        <h2>Cos’è Fulcron?</h2>
        <div class="poem ornate">
          <p>
            Sette furono gli Dei.<br />
            Sette cantarono e così cantando crearono il Tutto.<br />
            Cantava Hava, Dea del Cielo e dell’Aria.<br />
            Cantava Surya, Dio del Sole e della Vita.<br />
            Cantava Andhera, Dio della Notte e della Morte.<br />
            Cantava Yud’ah, Dio della Guerra e del Fuoco.<br />
            Cantava Samudra, Dea delle Acque.<br />
            Cantava Samajhadara, Dea della Sapienza.<br />
            Cantava Mausama, Dio del Mutamento.
          </p>
          <p>
            Così nacque Fulcron, l’Anello, e con esso le razze dei mortali che lo abitano.<br />
            Ere dopo la sua creazione, tanti sono i regni che i mortali hanno creato.
          </p>
        </div>
        <p>
          Fulcron è un “Anello”, senza dubbio, ma solo per quello che ne sappiamo noi, perché nessuno ne ha mai varcato
          i confini esterni. Certamente la storia ci insegna che sia sempre stato suddiviso in quattro grandi aree, e
          ancor più certamente questa divisione non è stata decisa solo da uomini e per ragioni politiche, ma dettata da
          qualcosa che va ben oltre la mente di chi abita Fulcron.
        </p>
        <ul class="litany">
          <li>Un mondo con un grande mare al centro e isole dalla rara bellezza.</li>
          <li>Un mondo abitato dalle più svariate creature e arricchito da molte diverse culture.</li>
          <li>Un mondo che ha visto prosperità e guerre, grandi eroi e indelebili dannati.</li>
          <li>Un mondo in cui la linea tra bene e male, giusto e sbagliato è molto labile.</li>
          <li>
            Un mondo in cui chi ha cercato la propria strada non sempre è riuscito a trovarla, o talvolta ha trovato ciò
            che non si aspettava, ma sicuramente ora ha una storia da raccontare.
          </li>
        </ul>
      </section>

      <section id="geografia">
        <h2>La geografia di Fulcron</h2>
        <p>
          Il mondo di Fulcron è singolare, oltre che per le creature fantastiche che lo abitano, anche per la sua
          geografia. La terra conosciuta di Fulcron è chiamata l’Anello proprio per la sua forma caratteristica.
        </p>
        <p>
          La nostra ambientazione si divide in cinque macroregioni, ognuna con caratteristiche e peculiarità proprie.
          Non preoccuparti se non conosci a menadito l’ambientazione di Fulcron: a ogni evento verranno fornite le
          informazioni necessarie per giocare senza problemi e, se vorrai approfondire, potrai sempre consultare la
          nostra <a :href="WIKI_URL" target="_blank" rel="noopener">wiki</a>.
        </p>
        <div class="tiles">
          <div v-for="r in regions" :key="r.name" v-reveal class="tile">
            <h3>{{ r.name }}</h3>
            <p>{{ r.text }}</p>
          </div>
        </div>
      </section>

      <section id="politica">
        <h2>La politica di Fulcron</h2>
        <p class="lead">Quelle tra Nord, Sud, Est e Ovest sono molto più che mere divisioni territoriali.</p>
        <p>
          Durante la Grande Guerra, scoppiata nel 2712, erano questi quattro grandi regni a combattersi ferocemente l’un
          l’altro, nel tentativo di instaurare la propria supremazia. Dopo la guerra, questi regni si sono per la
          maggior parte disgregati in stati più piccoli, ma la divisione rimane ancora molto forte e netta, soprattutto
          nella mentalità della gente comune.
        </p>
      </section>

      <section id="razze">
        <h2>Le razze di Fulcron</h2>
        <p class="lead">Sette sono le razze presenti a Fulcron.</p>
        <div class="tiles tiles--compact">
          <div v-for="(r, i) in races" :key="r.name" v-reveal="(i % 2) * 100" class="tile">
            <h3>{{ r.name }}</h3>
            <p>{{ r.text }}</p>
          </div>
        </div>
      </section>

      <section id="religioni">
        <h2>Le religioni di Fulcron</h2>
        <p>
          Il pantheon ufficiale di Fulcron è composto da sette divinità, venerate come creatrici del mondo e generatrici
          delle razze intelligenti che lo popolano.
        </p>
        <ul class="gods">
          <li v-for="g in gods" :key="g.name">
            <span class="god-name">{{ g.name }}</span>
            <span class="muted">{{ g.role }}</span>
          </li>
        </ul>
      </section>

      <section id="storia">
        <h2>La storia di Fulcron</h2>
        <div v-for="era in eras" :key="era.name" class="era">
          <h3 class="era-title">{{ era.name }}</h3>
          <ol class="timeline">
            <li v-for="(e, i) in era.events" :key="i" v-reveal>
              <span class="t-date">{{ e.date }}</span>
              <p>{{ e.event }}</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="wiki" class="wiki">
        <h2>La wiki di Fulcron</h2>
        <p>Per approfondire l’ambientazione di Fulcron (ed eventualmente contribuire), visita la nostra wiki!</p>
        <a class="btn btn-primary" :href="WIKI_URL" target="_blank" rel="noopener">
          Vai alla wiki <AppIcon name="external" :size="16" />
        </a>
      </section>
    </article>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: 3rem;
}
@media (min-width: 1000px) {
  .layout {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}
.toc {
  display: none;
}
@media (min-width: 1000px) {
  .toc {
    display: block;
    position: sticky;
    top: calc(var(--header-h) + 5rem);
    align-self: start;
  }
}
.toc-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 1px solid var(--border);
}
.toc a {
  display: block;
  padding: 0.35rem 0 0.35rem 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.92rem;
  margin-left: -1px;
  border-left: 1px solid transparent;
}
.toc a:hover {
  color: var(--ink);
  border-left-color: var(--gold);
}
.content {
  max-width: 820px;
  min-width: 0;
}
.toc-mobile {
  position: sticky;
  top: calc(var(--header-h) + var(--tabs-h) + 1px);
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0 calc(-1 * var(--gutter)) 2rem;
  padding: 0.6rem var(--gutter);
  background: color-mix(in srgb, var(--bg) 94%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.toc-mobile::-webkit-scrollbar {
  display: none;
}
.pill {
  flex-shrink: 0;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
}
.pill:hover,
.pill:focus-visible {
  border-color: var(--gold);
}
@media (min-width: 1000px) {
  .toc-mobile {
    display: none;
  }
}
.content > h1 {
  margin-bottom: 1.5rem;
}
.content section {
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--border);
}
.content section:last-child {
  border-bottom: 0;
}
.poem {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.6vw, 1.15rem);
  padding: 2.5rem 2rem;
  line-height: 1.8;
  color: var(--ink);
  text-align: center;
  margin-bottom: 2rem;
  background: radial-gradient(ellipse at top, rgb(184 145 63 / 0.12), transparent 70%), var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.poem p:last-child {
  margin: 0;
}
.litany {
  list-style: none;
  padding: 0;
}
.litany li {
  padding-left: 1.25rem;
  position: relative;
  margin-bottom: 0.5rem;
}
.litany li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background: var(--gold);
}
.tiles {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}
@media (min-width: 700px) {
  .tiles--compact {
    grid-template-columns: 1fr 1fr;
  }
}
.tile {
  padding: 1.25rem 1.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--gold);
  border-radius: var(--radius-sm);
}
.tile h3 {
  margin-bottom: 0.4rem;
  font-size: 1.3rem;
}
.tile p {
  margin: 0;
  font-size: 0.98rem;
}
.gods {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.gods li {
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.god-name {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--ink);
}
.era-title {
  margin-top: 1.5rem;
  color: var(--forest);
}
.timeline {
  list-style: none;
  padding: 0 0 0 1.5rem;
  margin: 0 0 1rem;
  border-left: 2px solid var(--border);
}
.timeline li {
  position: relative;
  padding-bottom: 1.4rem;
}
.timeline li::before {
  content: '';
  position: absolute;
  left: calc(-1.5rem - 7px);
  top: 0.4em;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--gold);
}
.t-date {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  color: var(--teal);
}
.timeline p {
  margin: 0.15rem 0 0;
}
.wiki {
  text-align: center;
}
</style>
