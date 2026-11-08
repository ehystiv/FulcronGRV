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

`photos` è facoltativo: un link esterno a un album di foto. Anche `place` (il luogo) è facoltativo, e lo è `date`
se la data precisa non si conosce.
Se l’evento ha una pagina sul sito, indicala con `page: "/oneshot/nome-pagina"`: compare il pulsante
“Visita la pagina dell’evento” e l’oneshot più recente con una pagina viene messa in evidenza.

## Pagine: `pagine/*.md`

Chi siamo, ambientazione, regolamento, inizia a giocare, privacy e le pagine del Palazzo dei Destini Incrociati e di Sunless Dawn
sono file in `pagine/`. Si scrivono in Markdown normale (titoli con `##`, elenchi con `-`, **grassetto**,
[link](https://esempio.it)) più alcuni blocchi speciali:

| Blocco | A cosa serve | Esempio |
| --- | --- | --- |
| `::banner{src="…" title="…"}` | foto a tutta larghezza con titolo | `chi-siamo.md` |
| `::poem` | testo centrato in un riquadro decorato | `ambientazione.md` |
| `::lore-tiles` | schede con titolo e testo | `ambientazione.md` |
| `::gods` | elenco delle divinità | `ambientazione.md` |
| `::timeline-era` + `:::timeline-event` | linea del tempo (con link e grassetti); aggiungi `level="2"` se non sta sotto un titolo `##`; su un evento, `chip="…"` mostra un’etichetta e `major` lo mette in risalto | `ambientazione.md`, `wiki/storia.md`, `pagine/eventi.md` |
| `::notice` | frase evidenziata | `regolamento.md` |
| `::world-map` | la mappa di Fulcron, apribile a schermo intero | `ambientazione.md` |
| `::examples` | esempi “da evitare” / “molto meglio” | `regolamento.md` |
| `::documents` | elenco di PDF da scaricare | `regolamento.md` |
| `::steps`, `::faq` | passi numerati, domande frequenti | `inizia-a-giocare.md` |
| `:button-link[Testo]{href="…"}` | bottone | `ambientazione.md` |

Il modo più semplice è copiare un blocco da una pagina esistente e cambiarne il testo.

## Prossimo evento: `pagine/prossimo-evento.md`

Il riquadro "Prossimo evento" in home e in fondo a "Inizia a giocare" legge questo file. Quando c'è un evento
in calendario compila `date` (es. `"18–19 aprile 2027"`), `until` (l'ultimo giorno, es. `2027-04-19`), `place`,
`cost` (es. `"Quota: 40 €"`) e, se c'è un modulo, `link`; il testo del file è la presentazione. Con `date` vuoto,
o passato il giorno `until`, il riquadro mostra il testo di `fallback` e rimanda a Instagram.

## Home: `home.yml`

I testi della home page: il titolo grande in alto con la sua foto, la presentazione, il riquadro sulla campagna,
le due schede (prima volta e oneshot) e l'invito a scrivere su Instagram. Ogni testo ha il suo campo: basta
cambiare le parole tra una riga e l'altra, lasciando com'è il nome del campo prima dei due punti. Se un testo
contiene i due punti, va racchiuso tra apici (`'così: ad esempio'`).

## Wiki: `wiki/**/*.md`

La wiki di Fulcron. Ogni cartella è una sezione (ad esempio `wiki/geopolitica/est/`) e il suo `index.md` è la
pagina della sezione. Il menu laterale si costruisce da solo a partire dalle cartelle: per aggiungere una pagina
basta creare un file nella cartella giusta. Anche la ricerca in cima alla wiki si aggiorna da sola a ogni deploy: trova
titoli, sezioni e testo delle pagine, ignorando maiuscole e accenti.

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

Le pagine vengono dal backup della vecchia wiki (Wiki.js); lo script di importazione è nella storia git.
