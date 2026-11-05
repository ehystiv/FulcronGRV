// Prepares the gallery: reads foto-originali/<album>/ and writes the published versions to
// public/foto/<album>/{thumb,large}/ plus the album data to content/gallery/<album>.json.
//
//   npm run gallery               every album
//   npm run gallery -- <album>    one album
//
// Run it again after adding or removing photos: finished ones are skipped. Hand-written fields of
// the JSON (title, date, photographer, poster, cover, exclude) are kept. To take a photo off the
// site, add its original file name to `exclude` and run the script.
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = 'foto-originali'
const OUTPUT = 'public/foto'
const DATA = 'content/gallery'
const SIZES = {
  thumb: { box: 640, quality: 68 },
  large: { box: 2000, quality: 78 },
}
const PHOTO = /\.(jpe?g|png|webp|tiff?)$/i

// sharp works one thread per image: the parallelism comes from running several images at once
sharp.concurrency(1)
sharp.cache(false)

const words = (slug) => slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
const webpName = (file) =>
  path
    .parse(file)
    .name.toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-') + '.webp'

async function pool(items, run) {
  let next = 0
  const worker = async () => {
    while (next < items.length) await run(items[next++])
  }
  await Promise.all(Array.from({ length: Math.min(availableParallelism(), 8) }, worker))
}

async function render(album, photo) {
  const target = (size) => path.join(OUTPUT, album, size, photo.name)
  const { mtimeMs } = await stat(photo.path)
  const fresh = async (file) => existsSync(file) && (await stat(file)).mtimeMs >= mtimeMs

  if ((await fresh(target('thumb'))) && (await fresh(target('large')))) {
    const { width, height } = await sharp(target('large')).metadata()
    return { width, height }
  }
  // rotate() applies the EXIF orientation; the output carries no metadata, so no GPS or camera data
  const image = sharp(photo.path).rotate()
  const write = (size) =>
    image
      .clone()
      .resize({ width: SIZES[size].box, height: SIZES[size].box, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: SIZES[size].quality })
      .toFile(target(size))
  await write('thumb')
  const { width, height } = await write('large')
  return { width, height }
}

async function processAlbum(album) {
  const folder = path.join(SOURCE, album)
  const dataFile = path.join(DATA, `${album}.json`)
  const meta = existsSync(dataFile) ? JSON.parse(await readFile(dataFile, 'utf8')) : {}
  const exclude = new Set(meta.exclude ?? [])

  const files = (await readdir(folder))
    .filter((f) => !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, 'it', { numeric: true }))
  const skipped = files.filter((f) => !PHOTO.test(f))
  if (skipped.length) console.warn(`  ${album}: ignorati, formato non supportato: ${skipped.join(', ')}`)

  // Byte-identical copies are dropped; two different files may still end up with the same name
  const seen = new Set()
  const names = new Set()
  const photos = []
  let copies = 0
  for (const file of files.filter((f) => PHOTO.test(f) && !exclude.has(f))) {
    const full = path.join(folder, file)
    const hash = createHash('sha1')
      .update(await readFile(full))
      .digest('hex')
    if (seen.has(hash)) {
      copies++
      continue
    }
    seen.add(hash)
    let name = webpName(file)
    if (names.has(name)) name = name.replace(/\.webp$/, `-${hash.slice(0, 6)}.webp`)
    names.add(name)
    photos.push({ source: file, path: full, name })
  }
  if (!photos.length) return console.log(`  ${album}: nessuna foto`)

  for (const size of Object.keys(SIZES)) await mkdir(path.join(OUTPUT, album, size), { recursive: true })

  const failed = []
  let done = 0
  await pool(photos, async (photo) => {
    try {
      Object.assign(photo, await render(album, photo))
    } catch (error) {
      failed.push(`${photo.source}: ${error.message}`)
    }
    if (++done % 50 === 0) console.log(`  ${album}: ${done}/${photos.length}`)
  })

  const published = photos.filter((p) => p.width)
  const keep = new Set(published.map((p) => p.name))
  for (const size of Object.keys(SIZES)) {
    const dir = path.join(OUTPUT, album, size)
    for (const file of await readdir(dir)) if (!keep.has(file)) await rm(path.join(dir, file))
  }

  await mkdir(DATA, { recursive: true })
  const data = {
    title: meta.title ?? words(album),
    ...meta,
    exclude: [...exclude],
    count: published.length,
    first: published[0]?.name,
    photos: published.map(({ name, width, height }) => ({ file: name, width, height })),
  }
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`)

  console.log(`  ${album}: ${published.length} foto${copies ? `, ${copies} copie identiche saltate` : ''}`)
  for (const line of failed) console.error(`  ${album}: ERRORE ${line}`)
  return failed.length
}

const only = process.argv[2]
const albums = only
  ? [only]
  : (await readdir(SOURCE, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)

let failures = 0
for (const album of albums) failures += (await processAlbum(album)) || 0
if (failures) process.exitCode = 1
