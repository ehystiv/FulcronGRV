<script setup lang="ts">
useHead({ title: 'Inizia a giocare' })
useSeoMeta({
  description:
    'Non hai mai fatto un gioco di ruolo dal vivo? Come funziona, come si crea un personaggio, come si combatte e come partecipare a un evento FulcronGRV.',
})

const steps = [
  {
    title: 'Leggi le regole base',
    text: 'Sono poche e si capiscono in dieci minuti: rispetto per gli altri, sicurezza, differenza tra In Gioco e Fuori Gioco.',
    to: '/sinfonia/regolamento',
    cta: 'Il regolamento',
  },
  {
    title: 'Scegli come giocare',
    text: 'Puoi creare il tuo personaggio (PG) oppure interpretarne uno preparato da noi (PNG o PGOS). Per iniziare vanno bene tutti e tre.',
  },
  {
    title: 'Dai un’occhiata al mondo',
    text: 'Non serve studiarlo: a ogni evento ti diamo le informazioni che ti servono. Ma due minuti sull’ambientazione aiutano.',
    to: '/sinfonia/ambientazione',
    cta: 'L’ambientazione',
  },
  {
    title: 'Scrivici e iscriviti',
    text: 'Date e iscrizioni le annunciamo sui nostri canali. Se hai dubbi, scrivici prima: preferiamo una domanda in più che un giocatore spaesato.',
  },
]

const faqs = [
  {
    q: 'Cos’è un gioco di ruolo dal vivo?',
    a: 'È un gioco in cui interpreti un personaggio in prima persona, in costume, insieme agli altri giocatori. Non ci sono un tabellone o dei dadi: quello che il tuo personaggio dice e fa, lo dici e lo fai tu. Gli organizzatori preparano la storia e i personaggi non giocanti; il resto lo costruite giocando.',
  },
  {
    q: 'Serve esperienza?',
    a: 'No. Il regolamento è pensato proprio perché chi arriva per la prima volta impari le basi in fretta, mentre chi gioca da anni ha comunque modo di far crescere il proprio personaggio.',
  },
  {
    q: 'Devo per forza creare un personaggio?',
    a: 'No. Oltre al PG (il tuo personaggio, creato da zero) puoi giocare come PNG, un personaggio scritto dai registi con indicazioni precise su cosa fare durante la giornata, oppure come PGOS: un personaggio preparato dalla regia, con background e obiettivi, che però gioca come tutti gli altri senza conoscere la trama. Sono due ottimi modi per provare.',
  },
  {
    q: 'Come si crea un personaggio?',
    a: 'Scegli chi è, da dove viene e cosa sa fare. Le capacità si comprano con i PAB (Punti Abilità): ogni personaggio parte con 130 PAB e per ogni giornata a cui partecipi ne guadagni almeno 10, qualunque ruolo tu abbia. Dare una mano (a sistemare dopo un evento, in cucina e così via) ne fa guadagnare altri.',
  },
  {
    q: 'Come funzionano i combattimenti?',
    a: 'Si usano armi in lattice, fatte per colpire senza farsi male. Magie, effetti speciali e colpi particolari si annunciano con poche chiamate a voce, che trovi nei manuali. La sicurezza viene prima di tutto: chi gioca in modo pericoloso viene allontanato.',
  },
  {
    q: 'Devo conoscere tutta l’ambientazione?',
    a: 'No. Fulcron ha molta storia alle spalle, ma a ogni evento diamo le informazioni necessarie per giocare. Se poi ti appassioni, c’è la wiki.',
  },
  {
    q: 'Cosa vuol dire “In Gioco” e “Fuori Gioco”?',
    a: 'In Gioco (IG) è tutto quello che riguarda il tuo personaggio; Fuori Gioco (FG) è quello che riguarda te come persona. Il personaggio non sa le cose che sai tu e viceversa. Per esempio, in gioco non si dice “quel mostro ha 3 punti ferita”, ma “ho visto quel mostro combattere, non è così forte”.',
  },
  {
    q: 'Dove si gioca, quanto costa, cosa devo portare?',
    a: 'Dipende dall’evento: luogo, quota e informazioni pratiche le trovi nell’annuncio di ciascuno. Se qualcosa non è chiaro, chiedici pure.',
  },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Nuovi giocatori"
      title="Inizia a giocare"
      lead="Non hai mai fatto un LARP? Ti serve meno di quanto pensi. Qui sotto trovi tutto quello che ci chiedono più spesso."
    />

    <section class="section">
      <div class="container">
        <h2 class="center">Da dove partire</h2>
        <div class="divider" aria-hidden="true"><span /></div>
        <ol class="steps">
          <li v-for="(step, i) in steps" :key="step.title" v-reveal="i * 100" class="step">
            <span class="step-n" aria-hidden="true">{{ i + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
            <NuxtLink v-if="step.to" :to="step.to" class="step-link">
              {{ step.cta }} <AppIcon name="arrow-right" :size="16" />
            </NuxtLink>
          </li>
        </ol>
      </div>
    </section>

    <section class="section faq-section">
      <div class="container prose">
        <h2 class="center">Domande frequenti</h2>
        <div class="divider" aria-hidden="true"><span /></div>
        <div class="faqs">
          <details v-for="item in faqs" :key="item.q" class="faq">
            <summary>{{ item.q }}</summary>
            <p>{{ item.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section">
      <div v-reveal class="container contact ornate">
        <h2>Hai ancora qualche dubbio?</h2>
        <p>Scrivici dove ti è più comodo, ti rispondiamo appena possiamo.</p>
        <ul class="btn-row contact-links">
          <li v-for="s in SOCIAL_LINKS" :key="s.name">
            <a :href="s.href" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              <AppIcon :name="s.name" :size="16" /> {{ s.label }}
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.steps {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
}
.step {
  position: relative;
  padding: 2.25rem 1.4rem 1.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.step-n {
  position: absolute;
  top: -1.1rem;
  left: 1.4rem;
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: var(--ink);
  color: var(--gold-soft);
  font-family: var(--font-display);
  font-size: 1.15rem;
  border: 2px solid var(--gold);
}
.step h3 {
  margin-bottom: 0.4rem;
}
.step p {
  font-size: 0.98rem;
  color: var(--text-muted);
}
.step-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.92rem;
}

.faq-section {
  background: linear-gradient(180deg, transparent, var(--surface-2) 30%, transparent);
}
.faqs {
  display: grid;
  gap: 0.75rem;
  margin-top: 2rem;
}
.faq {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.faq[open] {
  border-color: var(--gold);
}
.faq summary {
  position: relative;
  padding: 1rem 3rem 1rem 1.25rem;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  list-style: none;
}
.faq summary::-webkit-details-marker {
  display: none;
}
.faq summary::after {
  content: '';
  position: absolute;
  right: 1.25rem;
  top: 50%;
  width: 9px;
  height: 9px;
  border-right: 2px solid var(--gold);
  border-bottom: 2px solid var(--gold);
  transform: translateY(-70%) rotate(45deg);
  transition: transform 0.2s ease;
}
.faq[open] summary::after {
  transform: translateY(-30%) rotate(-135deg);
}
.faq p {
  margin: 0;
  padding: 0 1.25rem 1.1rem;
}

.contact {
  max-width: 760px;
  text-align: center;
  padding: clamp(2rem, 5vw, 3rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.contact-links {
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}
</style>
