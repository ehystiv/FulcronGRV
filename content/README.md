# Contenuti del sito

Tutti i testi del sito sono semplici file di testo in questa cartella.
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
photos: "https://link-all-album-di-foto"
---

Due righe per raccontare di cosa parlava.
```

`photos` è facoltativo: un link esterno a un album di foto.

## Pagine: `pagine/*.md`

Chi siamo, ambientazione, regolamento, inizia a giocare, privacy e la pagina del Palazzo dei Destini Incrociati
sono file in `pagine/`. Si scrivono in Markdown normale (titoli con `##`, elenchi con `-`, **grassetto**,
[link](https://esempio.it)) più alcuni blocchi speciali:

| Blocco | A cosa serve | Esempio |
| --- | --- | --- |
| `::banner{src="…" title="…"}` | foto a tutta larghezza con titolo | `chi-siamo.md` |
| `::poem` | testo centrato in un riquadro decorato | `ambientazione.md` |
| `::lore-tiles` | schede con titolo e testo | `ambientazione.md` |
| `::gods`, `::timeline` | divinità, linea del tempo | `ambientazione.md` |
| `::notice` | frase evidenziata | `regolamento.md` |
| `::examples` | esempi “da evitare” / “molto meglio” | `regolamento.md` |
| `::documents` | elenco di PDF da scaricare | `regolamento.md` |
| `::steps`, `::faq` | passi numerati, domande frequenti | `inizia-a-giocare.md` |
| `:button-link[Testo]{href="…"}` | bottone | `ambientazione.md` |

Il modo più semplice è copiare un blocco da una pagina esistente e cambiarne il testo.

## Wiki: `wiki/**/*.md`

La wiki di Fulcron. Ogni cartella è una sezione (ad esempio `wiki/geopolitica/est/`) e il suo `index.md` è la
pagina della sezione. Il menu laterale si costruisce da solo a partire dalle cartelle: per aggiungere una pagina
basta creare un file nella cartella giusta.

```md
---
title: "Partaros"
description: "La città santa"
updated: 2026-11-02
---

Testo della pagina. I titoli delle sezioni si scrivono con `##` e `###`.
Per collegare un’altra pagina: [Ordine dei Guaritori](/wiki/geopolitica/est/partaros/l-ordine-dei-guaritori).
```

`order` (facoltativo) decide la posizione nel menu: numeri più bassi vengono prima, il resto è in ordine
alfabetico. Le immagini della wiki stanno in `public/wiki/uploads/`.

Le pagine sono state importate dal backup della vecchia wiki (Wiki.js) con `scripts/import-wiki.mjs`.

## Importare i vecchi dati da MongoDB

Serve una volta sola, da chi ha accesso al database:

```bash
MONGODB_URI="mongodb://utente:password@host:27017/nome-db?authSource=admin" npm run export-mongo
```

Lo script crea i file qui dentro e salta i documenti cancellati. Gli album finiscono in `gallery/`: per ora non
vengono mostrati (la gallery è disattivata), ma restano pronti per quando la si riattiva. I file già esistenti non vengono
toccati (con `--force` vengono sovrascritti).
