# fulcrongrv.it

Sito dell'associazione di gioco di ruolo dal vivo **FulcronGRV**.

Stack: [Nuxt 4](https://nuxt.com) (Vue 3, Nitro) · MongoDB via Mongoose · CSS su misura (nessun framework UI) · font self-hosted.

## Requisiti

- Node.js ≥ 20.19 (consigliato 22, vedi `.nvmrc`)
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

| Variabile              | Descrizione                                                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NUXT_MONGODB_URI`     | Stringa di connessione MongoDB (es. `mongodb://user:pass@host:27017/db?authSource=admin`). Le credenziali vanno URL-encodate. Senza, il sito funziona ma Gallery, Oneshot e Bacheca mostrano un messaggio al posto dei contenuti. |
| `NUXT_GALLERY_DIR`     | Cartella con le foto degli album, una sottocartella per album (default `./gallery`).                                                                                                                                              |
| `NUXT_PUBLIC_SITE_URL` | URL pubblico del sito, per sitemap, canonical e Open Graph (default `https://fulcrongrv.it`).                                                                                                                                     |

Le vecchie variabili `DB_USER`, `DB_PASS`, `DB_IP`, `DB_IP_DEV`, `DB_PORT`, `DB_NAME`, `DB_AUTH` vanno sostituite da `NUXT_MONGODB_URI`.

## Dati

Le collezioni MongoDB sono le stesse della versione precedente (`albums`, `oneshots`, `posts`), quindi non serve migrare nulla. I documenti con `deleted: true` (soft delete del vecchio plugin `mongoose-delete`) sono nascosti.

- **Album**: `name`, `date`, `copertina`, `luogo`, `luogoIG`, `photos` (nome della cartella delle foto, es. `/alla-vecchia-spada`), `highQuality` (link opzionale).
- **Oneshot**: `title`, `date`, `img`, `description`, `type` (tag), `photo` (link alla gallery).
- **Post**: `title`, `text` (HTML, sanificato lato server), `image`, `tag`, `created_at`.

### Gallery

Per aggiungere un album: carica le foto in `NUXT_GALLERY_DIR/<slug>/` e crea il documento nella collezione `albums` con `photos: "/<slug>"`. Non serve toccare il codice. La pagina è `/gallery/<slug>`, con lightbox (tastiera e swipe).

## Struttura

```
app/          pagine, componenti, layout e stili (Vue 3)
server/api/   API JSON (/api/albums, /api/oneshots, /api/posts, /api/gallery/:slug)
server/routes foto degli album (/foto/:slug/:file) e sitemap.xml
public/       immagini, documenti PDF, favicon
```

I vecchi URL (`/who`, `/sinfonia`, `/api/foto/...`) vengono reindirizzati ai nuovi.
