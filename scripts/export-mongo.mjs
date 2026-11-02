#!/usr/bin/env node
// One-off export of the old MongoDB data (albums, oneshots, posts) to the
// Markdown files in /content. Documents soft-deleted (deleted: true) are skipped.
//
//   MONGODB_URI="mongodb://user:pass@host:27017/fulcron?authSource=admin" npm run export-mongo
//
// Existing files are never overwritten unless you pass --force.
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { albumToMarkdown, oneshotToMarkdown, postToMarkdown } from './mongo-to-markdown.mjs'

const uri = process.env.MONGODB_URI
const force = process.argv.includes('--force')
if (!uri) {
  console.error('Imposta MONGODB_URI con la stringa di connessione al database.')
  process.exit(1)
}

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content')
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 })

const jobs = [
  ['posts', postToMarkdown],
  ['oneshots', oneshotToMarkdown],
  ['albums', albumToMarkdown],
]

try {
  const db = client.db()
  for (const [collection, convert] of jobs) {
    const docs = await db
      .collection(collection)
      .find({ deleted: { $ne: true } })
      .toArray()
    let written = 0
    for (const doc of docs) {
      const { path, content } = convert(doc)
      const target = join(contentDir, path)
      if (existsSync(target) && !force) {
        console.warn(`  già presente, salto: content/${path}`)
        continue
      }
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, content)
      written++
    }
    console.log(`${collection}: ${written}/${docs.length} file scritti`)
  }
} finally {
  await client.close()
}
