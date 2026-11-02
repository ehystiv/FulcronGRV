<script setup lang="ts">
useHead({ title: 'Privacy' })
useSeoMeta({ description: 'Come FulcronGRV tratta i dati di chi visita il sito.' })
</script>

<template>
  <div>
    <PageHero
      eyebrow="Informativa"
      title="Privacy"
      lead="Cosa succede ai tuoi dati quando visiti questo sito. In breve: quasi nulla."
    />

    <div class="container section">
      <article class="prose policy">
        <p class="muted">Ultimo aggiornamento: novembre 2026</p>

        <h2>Chi è il titolare</h2>
        <p>
          Il titolare del trattamento è l’{{ ASSOCIATION.name
          }}<template v-if="ASSOCIATION.address">, con sede in {{ ASSOCIATION.address }}</template
          ><template v-if="ASSOCIATION.taxCode"> (codice fiscale {{ ASSOCIATION.taxCode }})</template>.
          <template v-if="ASSOCIATION.email">
            Per qualsiasi domanda puoi scriverci a <a :href="`mailto:${ASSOCIATION.email}`">{{ ASSOCIATION.email }}</a
            >.
          </template>
          <template v-else>Per qualsiasi domanda puoi contattarci sui canali che trovi in fondo alla pagina.</template>
        </p>

        <h2>Niente cookie, niente profilazione</h2>
        <p>
          Questo sito non usa cookie, né nostri né di terze parti, e non ti chiede di registrarti. Font e immagini sono
          ospitati sul nostro server: navigando qui non contatti servizi esterni come Google Fonts o reti pubblicitarie.
        </p>

        <h2>Statistiche delle visite</h2>
        <p>
          Per capire quali pagine vengono lette contiamo le visite in forma anonima. Per ogni giorno salviamo solo
          quante volte è stata vista ciascuna pagina e, se arrivi da un altro sito, il nome di quel sito (ad esempio
          “facebook.com”). Non salviamo il tuo indirizzo IP né identificativi che permettano di riconoscerti o di
          seguirti da una visita all’altra.
        </p>
        <p>
          Se il tuo browser ha attivato “Do Not Track” o “Global Privacy Control”, la tua visita non viene contata
          affatto.
        </p>

        <h2>Dati tecnici del server</h2>
        <p>
          Come quasi ogni sito, il server che ci ospita può registrare per un periodo limitato dati tecnici delle
          richieste (indirizzo IP, data e ora, pagina richiesta), che servono solo a garantirne il funzionamento e la
          sicurezza.
        </p>

        <h2>Link ad altri servizi</h2>
        <p>
          Nel sito trovi link a Facebook, Instagram, YouTube, Telegram, WhatsApp, Google Drive e Google Moduli. Quando
          li apri esci dal nostro sito e valgono le informative di quei servizi. Se ti iscrivi a un evento con un
          modulo, i dati che inserisci li usiamo solo per organizzare quell’evento.
        </p>

        <h2>I tuoi diritti</h2>
        <p>
          Secondo il Regolamento europeo 2016/679 (GDPR) puoi chiederci in qualsiasi momento di accedere ai dati che ti
          riguardano, di correggerli o cancellarli, di limitarne l’uso o di opporti al trattamento. Se pensi che i tuoi
          dati siano stati trattati in modo scorretto puoi anche rivolgerti al
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener"
            >Garante per la protezione dei dati personali</a
          >.
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.policy h2 {
  font-size: 1.5rem;
  margin-top: 2.25rem;
}
</style>
