// Checks content/mappa.yml, the places of the interactive map. Runs with the link tests:
//
//   node --test tests/mappa.test.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const lines = readFileSync('content/mappa.yml', 'utf8').split('\n')

test('texts with a colon are in quotes', () => {
  // Unquoted, "Stemma: una tigre nera" is read as a field named "Stemma", and the card shows code
  const bad = lines
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /^\s+(?:-\s+)?(?:nome|dipinto|etichetta|testo):\s+[^'"\s{[].*:\s/.test(line))
    .map(({ line, n }) => `riga ${n}: ${line.trim().slice(0, 70)}…`)
  assert.deepEqual(bad, [], 'Metti tra virgolette questi testi, perché contengono «: »')
})

test('every place has its own id', () => {
  const ids = lines.flatMap((line) => line.match(/(?:^\s+-\s+id:|\{\s*id:)\s*([\w-]+)/)?.[1] ?? [])
  const twice = ids.filter((id, i) => ids.indexOf(id) !== i)
  assert.deepEqual(twice, [], 'Questi id compaiono due volte')
})
