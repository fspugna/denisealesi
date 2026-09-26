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
  apiVersion: '2026-09-26',
  useCdn: false,
})

const desiredOrder = [
  ['Silenzio', '0|100008:'],
  ['Il Sogno e la Materia', '0|10000o:'],
  ['Immagini e parole', '0|100014:'],
  ['Luci e ombre', '0|10001k:'],
  ['Firenze, tu', '0|100020:'],
]

const galleries = await client.fetch(`*[_type == "galleriaFotografica"]{
  _id,
  orderRank,
  traduzioni[]{language, titolo}
}`)

const titleOf = (gallery) => gallery.traduzioni?.find((translation) => translation.language === 'it')?.titolo
  || gallery.traduzioni?.[0]?.titolo

const byTitle = new Map(galleries.map((gallery) => [titleOf(gallery), gallery]))

for (const [title] of desiredOrder) {
  if (!byTitle.has(title)) throw new Error(`Galleria non trovata: ${title}`)
}

if (galleries.length !== desiredOrder.length) {
  throw new Error(`Attese ${desiredOrder.length} gallerie, trovate ${galleries.length}. Aggiorna l'ordine prima di procedere.`)
}

console.table(desiredOrder.map(([title, orderRank], index) => ({
  posizione: index + 1,
  titolo: title,
  orderRankAttuale: byTitle.get(title).orderRank || 'non impostato',
  orderRankNuovo: orderRank,
})))

if (!execute) {
  console.log('Analisi completata. Usa --execute per applicare il nuovo ordine.')
  process.exit(0)
}

let transaction = client.transaction()

for (const [title, orderRank] of desiredOrder) {
  transaction = transaction.patch(byTitle.get(title)._id, {set: {orderRank}})
}

await transaction.commit({visibility: 'async', tag: 'gallery-order-initialization'})
console.log('Ordine delle gallerie aggiornato con successo.')
