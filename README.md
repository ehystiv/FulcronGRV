# fulcrongrv.it

Sito dell'associazione di gioco di ruolo dal vivo **FulcronGRV**.

È un **sito statico**: niente server Node, niente database. `npm run generate` produce una cartella di file HTML,
CSS, JS e immagini (`.output/public`) che si può pubblicare su qualsiasi hosting statico o servire con nginx/Apache.

Stack: [Nuxt 4](https://nuxt.com) · [Nuxt Content](https://content.nuxt.com) (testi in Markdown) ·
[Tailwind CSS 4](https://tailwindcss.com) · [Nuxt Image](https://image.nuxt.com) (WebP generati in build) · font self-hosted.

## Requisiti

- Node.js ≥ 22.5 (vedi `.nvmrc`), solo per sviluppare e generare il sito

## Comandi

```bash
npm install
npm run dev        # sviluppo su http://localhost:8080
npm run generate   # genera il sito statico in .output/public
npm run preview    # prova in locale il sito generato
npm run typecheck  # controllo dei tipi
```

L'unica variabile d'ambiente è `NUXT_PUBLIC_SITE_URL` (default `https://fulcrongrv.it`), usata per sitemap, link
canonici e Open Graph.

## Contenuti

Tutti i testi stanno nella cartella `content/` e si modificano senza toccare il codice: pagine, notizie della
bacheca e oneshot sono file Markdown. Guida ed esempi in [`content/README.md`](content/README.md).

## Struttura

```
content/                  testi del sito (Markdown)
  pagine/                 chi siamo, ambientazione, regolamento, inizia a giocare, privacy…
  bacheca/  oneshot/      una notizia / una oneshot per file
  wiki/                   la wiki di Fulcron (cartelle = sezioni)
app/
  assets/css/main.css     Tailwind: colori, font e stili di base del tema
  components/ui/          componenti di base (UiButton, UiCard, UiSectionTitle…)
  components/content/     blocchi usabili nei Markdown (::banner, ::faq, ::timeline…)
  components/wiki/        menu della wiki
  components/             header, footer e componenti condivisi
  composables/usePage.ts  carica una pagina da content/pagine
  pages/                  una pagina Vue per ogni URL
public/                   immagini, PDF dei manuali, favicon
server/routes/            sitemap.xml (generata in build)
scripts/                  importazioni una tantum: vecchi dati da MongoDB, backup della vecchia wiki
```

## Note

- La **gallery** è disattivata finché non ci sono foto da pubblicare. Lo script di importazione da MongoDB salva
  comunque i dati degli album in `content/gallery/`, così non vanno persi quando la si riattiva.
- I vecchi indirizzi `/who` e `/sinfonia` reindirizzano alle nuove pagine.
- La wiki, prima su `wikia.fulcrongrv.it`, ora è una sezione del sito (`/wiki`). Se il vecchio sottodominio è ancora
  attivo, conviene reindirizzarlo a `https://fulcrongrv.it/wiki`.
