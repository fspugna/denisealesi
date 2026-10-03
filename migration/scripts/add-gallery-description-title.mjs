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

const gallery = await client.fetch(`*[_id == "legacy-gallery-19"][0]{
  _id,
  _rev,
  traduzioni
}`)

if (!gallery) throw new Error('Galleria “Immagini e parole” non trovata.')

const translation = gallery.traduzioni?.find((item) => item.language === 'it')
if (!translation) throw new Error('Traduzione italiana non trovata.')

const descriptionTitle = 'Un po’ di tempo fa.'
if (translation.titoloDescrizione && translation.titoloDescrizione !== descriptionTitle) {
  throw new Error(`Il titolo descrittivo contiene già un valore diverso: ${translation.titoloDescrizione}`)
}

console.table([{
  galleria: translation.titolo,
  titoloAttuale: translation.titoloDescrizione || 'non impostato',
  titoloNuovo: descriptionTitle,
}])

if (!execute) {
  console.log('Analisi completata. Usa --execute per applicare il titolo descrittivo.')
  process.exit(0)
}

const translations = gallery.traduzioni.map((item) => item._key === translation._key
  ? {...item, titoloDescrizione: descriptionTitle}
  : item)

await client
  .patch(gallery._id)
  .ifRevisionId(gallery._rev)
  .set({traduzioni: translations})
  .commit({visibility: 'sync', tag: 'gallery-description-title'})

console.log('Titolo descrittivo aggiornato con successo.')
