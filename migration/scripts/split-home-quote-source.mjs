import {existsSync, readFileSync} from 'node:fs'
import {createClient} from '@sanity/client'

function loadEnvironment() {
  for (const file of ['.env', '.env.local']) {
    if (!existsSync(file)) continue

    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}

function toPlainText(block) {
  if (block?._type !== 'block') return ''
  return (block.children || []).map((child) => child.text || '').join('')
}

loadEnvironment()

const execute = process.argv.includes('--execute')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) throw new Error('Configurazione Sanity incompleta.')
if (execute && !token) throw new Error('SANITY_API_WRITE_TOKEN necessario per applicare le modifiche.')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-10-10',
  useCdn: false,
  perspective: 'raw',
})

const header = await client.fetch(`*[_id == "header"][0]{_id, _rev, traduzioni}`)
if (!header) throw new Error('Documento Header Homepage non trovato.')

let changed = false
const rows = []
const translations = (header.traduzioni || []).map((translation) => {
  if (translation.fonteCitazione?.length) {
    rows.push({lingua: translation.language, esito: 'fonte già separata'})
    return translation
  }

  if (!translation.citazione?.length || translation.citazione.length < 2) {
    rows.push({lingua: translation.language, esito: 'nessuna fonte da separare'})
    return translation
  }

  const sourceBlock = translation.citazione.at(-1)
  const sourceText = toPlainText(sourceBlock).trim()
  if (!/^\(?\s*(tratto da|taken from|extra[ií]do de|tomado de)\b/i.test(sourceText)) {
    rows.push({lingua: translation.language, esito: `ultimo paragrafo non riconosciuto: ${sourceText}`})
    return translation
  }

  changed = true
  rows.push({lingua: translation.language, esito: `separata: ${sourceText}`})
  return {
    ...translation,
    citazione: translation.citazione.slice(0, -1),
    fonteCitazione: [sourceBlock],
  }
})

console.table(rows)

if (!execute) {
  console.log(changed ? 'Analisi completata. Usa --execute per applicare la modifica.' : 'Nessuna modifica necessaria.')
  process.exit(0)
}

if (!changed) {
  console.log('Nessuna modifica applicata.')
  process.exit(0)
}

await client
  .patch(header._id)
  .ifRevisionId(header._rev)
  .set({traduzioni: translations})
  .commit({visibility: 'sync', tag: 'split-home-quote-source'})

console.log('Fonte della citazione separata con successo.')
