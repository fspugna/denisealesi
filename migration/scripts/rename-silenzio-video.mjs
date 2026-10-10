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
const newTitle = 'Silenzio - video'

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

const videos = await client.fetch(`*[_type == "video"]{
  _id,
  _rev,
  "slug": slug.current,
  traduzioni
}`)

const video = videos.find((item) =>
  item.slug?.startsWith('silenzio-') || item.traduzioni?.some((translation) => /silenzio/i.test(translation.titolo || '')),
)

if (!video) throw new Error('Video “Silenzio” non trovato.')

let changed = false
const translations = (video.traduzioni || []).map((translation) => {
  if (translation.titolo === newTitle) return translation
  changed = true
  return {...translation, titolo: newTitle}
})

console.table((video.traduzioni || []).map((translation) => ({
  lingua: translation.language,
  titoloAttuale: translation.titolo,
  titoloNuovo: newTitle,
})))

if (!execute) {
  console.log(changed ? 'Analisi completata. Usa --execute per aggiornare il titolo.' : 'Il titolo è già aggiornato.')
  process.exit(0)
}

if (!changed) {
  console.log('Nessuna modifica applicata.')
  process.exit(0)
}

await client
  .patch(video._id)
  .ifRevisionId(video._rev)
  .set({traduzioni: translations})
  .commit({visibility: 'sync', tag: 'rename-silenzio-video'})

console.log('Titolo del video aggiornato con successo.')
