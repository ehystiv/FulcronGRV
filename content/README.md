# Contenuti del sito

Notizie, oneshot e album della gallery sono semplici file di testo in questa cartella.
Per pubblicare qualcosa basta aggiungere o modificare un file e rifare il deploy.
Si può fare anche dal browser, direttamente su GitHub ("Add file" → "Create new file").

Ogni file inizia con un blocco tra due righe `---` (i dati) e poi, se serve, il testo.
Le date si scrivono `AAAA-MM-GG`. Le immagini vanno in `public/` e si indicano col percorso
che inizia da `/` (ad esempio `public/posts/foto.jpg` diventa `/posts/foto.jpg`).

## Bacheca: `bacheca/2024-05-10-titolo-della-notizia.md`

```md
---
title: "La profezia delle Terre Verdi"
date: 2024-05-10
image: "/posts/La profezia delle Terre Verdi.png"
tags: ["Est", "Lore"]
---

Qui va il testo della notizia. Si può usare il **grassetto**, il *corsivo*,
gli elenchi e i [link](https://esempio.it).
```

`image` e `tags` sono facoltativi.

## Oneshot: `oneshot/nome-della-oneshot.md`

```md
---
title: "Tear Asunder"
date: 2019-10-31
image: "/oneshots/TearAsunder.jpg"
tags: ["PGOS"]
photos: "/gallery/tear-asunder"
---

Due righe per raccontare di cosa parlava.
```

`photos` è facoltativo: può essere un album della gallery o un link esterno.

## Gallery: `gallery/nome-cartella.md`

```md
---
title: "Alla Vecchia Spada"
date: 2019-08-02
cover: "/albums/allavecchiaspada.jpg"
place: "Castiglione dei Pepoli"
placeIG: "Rifugio Ranuzzi Segni"
highQuality: "https://link-alla-cartella-in-alta-qualita"
---
```

Le foto vanno nella cartella della gallery sul server (`NUXT_GALLERY_DIR`), in una sottocartella
con lo stesso nome del file (qui `nome-cartella`). Se la cartella ha un nome diverso, aggiungi
`folder: "nome-della-cartella"`. `place`, `placeIG` e `highQuality` sono facoltativi.

## Importare i vecchi dati da MongoDB

Serve una volta sola, da chi ha accesso al database:

```bash
MONGODB_URI="mongodb://utente:password@host:27017/nome-db?authSource=admin" npm run export-mongo
```

Lo script crea i file qui dentro e salta i documenti cancellati. I file già esistenti non vengono
toccati (con `--force` vengono sovrascritti).
