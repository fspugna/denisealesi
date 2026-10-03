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

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
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
  apiVersion: '2026-10-03',
  useCdn: false,
})

const documents = await client.fetch(`
  *[_type in ["opera", "galleriaFotografica", "video"]] | order(_type asc, _createdAt asc){
    _id,
    _rev,
    _type,
    "currentSlug": slug.current,
    "title": coalesce(
      traduzioni[language == "it"][0].titolo,
      traduzioni[0].titolo,
      titolo
    )
  }
`)

const usedByType = new Map()
const changes = []

for (const document of documents) {
  if (!document.title) throw new Error(`Titolo mancante per ${document._type} ${document._id}.`)

  const used = usedByType.get(document._type) || new Set()
  usedByType.set(document._type, used)

  if (document.currentSlug) {
    if (used.has(document.currentSlug)) {
      throw new Error(`Slug duplicato già presente: ${document._type}/${document.currentSlug}`)
    }
    used.add(document.currentSlug)
    continue
  }

  const base = slugify(document.title)
  if (!base) throw new Error(`Impossibile generare lo slug per “${document.title}”.`)

  let slug = base
  let suffix = 2
  while (used.has(slug)) {
    slug = `${base}-${suffix}`
    suffix += 1
  }
  used.add(slug)
  changes.push({...document, slug})
}

console.table(changes.map((document) => ({
  tipo: document._type,
  idAttuale: document._id,
  titolo: document.title,
  nuovoSlug: document.slug,
})))

if (!execute) {
  console.log(`Analisi completata: ${changes.length} slug da aggiungere. Usa --execute per applicarli.`)
  process.exit(0)
}

if (!changes.length) {
  console.log('Tutti i contenuti hanno già uno slug.')
  process.exit(0)
}

let transaction = client.transaction()
for (const document of changes) {
  transaction = transaction.patch(document._id, (patch) => patch
    .ifRevisionId(document._rev)
    .set({slug: {_type: 'slug', current: document.slug}}))
}

await transaction.commit({visibility: 'sync', tag: 'add-content-slugs'})
console.log(`${changes.length} slug aggiunti con successo.`)
