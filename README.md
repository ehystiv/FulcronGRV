# fulcrongrv.it

Sito dell'associazione di gioco di ruolo dal vivo **FulcronGRV**.

È un **sito statico**: niente server Node, niente database. `npm run generate` produce una cartella di file HTML,
CSS, JS e immagini (`.output/public`) che si può pubblicare su qualsiasi hosting statico o servire con nginx/Apache.

Stack: [Nuxt 4](https://nuxt.com) · [Nuxt Content](https://content.nuxt.com) (testi in Markdown) ·
[Tailwind CSS 4](https://tailwindcss.com) · [Nuxt Image](https://image.nuxt.com) (WebP generati in build) · font self-hosted.

## Requisiti

- Node.js 26 (vedi `.nvmrc`; `engines` in `package.json` lo fissa anche per le build su Vercel), solo per
  sviluppare e generare il sito

## Comandi

```bash
npm install
npm run dev        # sviluppo su http://localhost:8080
npm run generate   # genera il sito statico in .output/public
npm run preview    # prova in locale il sito generato
npm run typecheck  # controllo dei tipi
npm run format:check  # controlla la formattazione (Prettier)
npm run lint       # controlla il codice Vue e TypeScript (ESLint)
npm test           # dopo generate: link rotti e test nel browser (Playwright)
```

Variabili d'ambiente:

- `NUXT_PUBLIC_SITE_URL` (default `https://fulcrongrv.it`): usata per sitemap, link canonici e Open Graph.
- `NUXT_PUBLIC_GALLERY_URL`: da dove arrivano le foto della gallery. Se non è impostata si usa `/foto` quando
  `public/foto/` contiene le foto generate da `npm run gallery`, altrimenti il bucket di produzione
  `https://foto.fulcrongrv.it`. Così un clone appena fatto si genera senza passaggi in più.

## Test

I test girano sul sito già generato, quindi prima serve `npm run generate`:

- `npm run test:links` controlla che ogni link e immagine interna di ogni pagina porti a un file esistente.
- `npm run test:e2e` apre il sito in Chromium (desktop e telefono) con `tests/serve.mjs`, che risponde come Vercel,
  404 compresi: le pagine principali, il 404, il menu del telefono, la wiki e la gallery. La prima volta serve
  `npx playwright install chromium`.

La CI su GitHub esegue formattazione, lint, tipi, build e tutti i test a ogni PR.

## Contenuti

Tutti i testi stanno nella cartella `content/` e si modificano senza toccare il codice: pagine, notizie della
bacheca e oneshot sono file Markdown. Guida ed esempi in [`content/README.md`](content/README.md).

## Struttura

```
content/                  testi del sito (Markdown)
  home.yml                testi della home page
  pagine/                 chi siamo, ambientazione, regolamento, inizia a giocare, privacy…
  bacheca/  oneshot/      una notizia / una oneshot per file
  wiki/                   la wiki di Fulcron (cartelle = sezioni)
app/
  assets/css/main.css     Tailwind: colori, font e stili di base del tema
  components/ui/          componenti di base (UiButton, UiCard, UiSectionTitle…)
  components/content/     blocchi usabili nei Markdown (::banner, ::faq, ::timeline…)
  components/wiki/        menu e ricerca della wiki
  components/             header, footer e componenti condivisi
  composables/usePage.ts  carica una pagina da content/pagine
  composables/useSocialMeta.ts  titolo, descrizione e anteprima di condivisione di una pagina
  pages/                  una pagina Vue per ogni URL
public/                   immagini, PDF dei manuali, favicon
modules/sitemap.ts        scrive sitemap.xml alla fine della build, dalle pagine generate
server/routes/            l'indice della ricerca nella wiki (wiki-search.json, generato in build)
scripts/gallery.mjs       prepara le foto della gallery (npm run gallery)
```

## Stile

I colori, i font e le misure del tema stanno in `@theme` in `app/assets/css/main.css`. Per i testi del sito ci
sono cinque livelli, da usare al posto di misure scritte a mano:

| Classe            | Per                                       |
| ----------------- | ----------------------------------------- |
| `text-display`    | il titolo grande della home               |
| `text-title`      | il titolo (h1) di una pagina              |
| `text-heading`    | il titolo di una sezione (h2)             |
| `text-subheading` | il titolo di un riquadro o una scheda     |
| `text-lead`       | il testo di presentazione sotto un titolo |

`py-section` dà lo spazio verticale standard di una sezione, `bg-page-header` lo sfondo delle testate di campagna e
wiki. Le pagine delle oneshot hanno invece una grafica tutta loro, vedi sotto.

### Una nuova pagina oneshot

Le pagine di Sunless Dawn, La Teoria del Nulla e Il Palazzo dei Destini Incrociati sono ricostruzioni dei siti
originali, ognuna con il suo stile. Seguono tutte lo stesso schema, da ripetere per la prossima:

1. I testi in `content/pagine/<nome>.md` (con `title`, `description`, `image` e i campi che servono), caricati nella
   pagina con `usePage('<nome>')`, che imposta anche titolo e anteprima di condivisione.
2. La pagina in `app/pages/oneshot/<nome>.vue`, che importa il proprio foglio di stile
   (`import '~/assets/css/<nome>.css'`): così i font e gli stili dell'evento si scaricano solo lì.
3. Tutte le classi sotto un prefisso proprio (`.sunless`, `.teoria`, `sd-`, `td-`), così non toccano il resto del
   sito.
4. I blocchi usati nel Markdown in `app/components/content/<Nome>*.vue`, quelli usati solo dalla pagina in
   `app/components/<nome>/`.
5. La scheda in `content/oneshot/<nome>.md`, con `page: /oneshot/<nome>` per collegarla, e la pagina nell'elenco
   `PAGES` di `tests/e2e/pages.spec.ts`.

## Foto su R2

In produzione le foto della gallery non sono nel repo né su Vercel: stanno in un bucket Cloudflare R2, servito da
`https://foto.fulcrongrv.it` (custom domain del bucket). Il bucket contiene la stessa struttura di `public/foto/`,
cioè `<album>/thumb/` e `<album>/large/`.

Su Vercel `public/foto/` non esiste, quindi la build usa già `https://foto.fulcrongrv.it`. Impostare comunque
`NUXT_PUBLIC_GALLERY_URL=https://foto.fulcrongrv.it` per Production e Preview rende la scelta esplicita; la variabile
vale solo per le build successive, quindi dopo averla cambiata serve un nuovo deploy.

In locale, se `public/foto/` è solo parziale (alcuni album sì e altri no), la build fallisce sulle foto mancanti:
rigenerala con `npm run gallery` oppure imposta `NUXT_PUBLIC_GALLERY_URL=https://foto.fulcrongrv.it`.

Per caricare le foto serve [rclone](https://rclone.org), configurato con un remote `r2` di tipo S3 (provider
Cloudflare), un token R2 con permesso `Object Read & Write` sul solo bucket e l'endpoint
`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. Le chiavi restano fuori dal repo.

Quando aggiungi o togli foto:

```bash
npm run gallery                                    # aggiorna public/foto e content/gallery
rclone sync public/foto r2:<bucket> --dry-run      # mostra cosa cambierebbe
rclone sync public/foto r2:<bucket> --transfers 16 --progress
```

Poi fai il commit dei JSON in `content/gallery/` e il deploy del sito.

- `rclone sync` rende il bucket identico a `public/foto/` e **cancella** dal bucket ciò che in locale non c'è. Serve
  per togliere davvero una foto: con `rclone copy` resterebbe online. Per lo stesso motivo va lanciato solo con
  `public/foto/` completa; se la cartella è vuota o parziale, prima rigenerala con `npm run gallery`.
- Rinominare un album significa rinominare anche la sua cartella: con `sync` la vecchia sparisce e la nuova viene
  ricaricata.
- Le foto hanno una cache di alcune ore, quindi una foto tolta può restare visibile per un po' a chi l'ha già
  caricata.

## Note

- La **gallery** nasce da `foto-originali/<album>/`, che resta fuori da git: `npm run gallery` crea le versioni
  pubblicate in `public/foto/` e i dati in `content/gallery/<album>.json`. Lì si scrivono a mano `title`, `date`,
  `place`, `photographer` (credito mostrato nella pagina dell'album, vale per tutto l'album), `poster` (percorso della
  locandina in `public/`, che nell'elenco degli album prende il posto della foto di copertina), `cover` (nome di una
  delle foto) ed `exclude` (nomi degli originali da togliere dal sito, poi si rilancia lo script). Anche
  `public/foto/` è fuori da git: in produzione le foto stanno su Cloudflare R2, vedi [Foto su R2](#foto-su-r2).
- `vercel.json` dichiara le route a mano: il preset Nuxt di Vercel manda ogni indirizzo sconosciuto a `200.html`, che
  risponde 200, mentre così le pagine inesistenti danno un vero 404. `framework: null` non basta, perché Vercel rileva
  comunque Nuxt da `package.json`.
- `vercel.json` aggiunge anche alcuni header di sicurezza su tutte le pagine e la cache: un anno per `/_nuxt/` (file
  con hash nel nome), un giorno per le immagini di `/_ipx/` (il loro indirizzo non cambia se cambia l'immagine).
- I vecchi indirizzi `/who` e `/sinfonia` reindirizzano alle nuove pagine.
- La wiki, prima su `wikia.fulcrongrv.it`, ora è una sezione del sito (`/wiki`). Se il vecchio sottodominio è ancora
  attivo, conviene reindirizzarlo a `https://fulcrongrv.it/wiki`.
