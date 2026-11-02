# fulcrongrv.it

Sito dell'associazione di gioco di ruolo dal vivo **FulcronGRV**.

Stack: [Nuxt 4](https://nuxt.com) (Vue 3, Nitro) · [Nuxt Content](https://content.nuxt.com) (Markdown) · CSS su misura (nessun framework UI) · font self-hosted.

## Requisiti

- Node.js ≥ 22.5 (vedi `.nvmrc`)
- npm

## Sviluppo

```bash
npm install
cp .env.example .env   # poi compila i valori
npm run dev            # http://localhost:8080
```

## Produzione

```bash
npm run build
node .output/server/index.mjs   # porta da PORT (default 3000)
```

## Configurazione (variabili d'ambiente)

| Variabile | Descrizione |
| --- | --- |
| `NUXT_GALLERY_DIR` | Cartella con le foto degli album, una sottocartella per album (default `./gallery`). |
| `NUXT_PUBLIC_SITE_URL` | URL pubblico del sito, per sitemap, canonical e Open Graph (default `https://fulcrongrv.it`). |
| `NUXT_STATS_KEY` | Chiave segreta per vedere le statistiche su `/statistiche?key=…`. Se vuota la pagina è disattivata (le visite vengono comunque contate). |

## Contenuti

Notizie della bacheca, oneshot e album della gallery sono file Markdown nella cartella `content/`: per pubblicare
basta aggiungere un file. Istruzioni ed esempi in [`content/README.md`](content/README.md).

I vecchi dati erano su MongoDB: per importarli una volta sola c'è `npm run export-mongo` (vedi lo stesso README).
Il sito non usa più nessun database.

## Statistiche

Le visite si contano senza cookie e senza salvare indirizzi IP: per ogni giorno restano solo il numero di
visualizzazioni per pagina e i siti di provenienza. I dati stanno in `.data/kv/stats/` sul server, quindi quella
cartella va conservata tra un deploy e l'altro.

## Da completare

- Dati ufficiali dell'associazione (sede, codice fiscale, email) in `app/utils/site.ts` → `ASSOCIATION`:
  compaiono nella pagina Privacy.

## Struttura

```
app/          pagine, componenti, layout e stili (Vue 3)
content/      notizie, oneshot e album (Markdown)
server/api/   elenco foto degli album (/api/gallery/:slug) e statistiche
server/routes foto degli album (/foto/:slug/:file) e sitemap.xml
scripts/      importazione una tantum dei vecchi dati da MongoDB
public/       immagini, documenti PDF, favicon
```

I vecchi URL (`/who`, `/sinfonia`, `/api/foto/...`) vengono reindirizzati ai nuovi.
