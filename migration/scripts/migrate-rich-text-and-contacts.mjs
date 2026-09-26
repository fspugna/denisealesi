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
  perspective: 'raw',
})

const contacts = {
  _id: 'contatti',
  _type: 'contatti',
  email: 'denise.alesi@alice.it',
  social: [
    {_key: 'facebook', _type: 'socialItem', nome: 'Facebook', url: 'https://www.facebook.com/denise.alesi.583'},
    {_key: 'instagram', _type: 'socialItem', nome: 'Instagram', url: 'https://www.instagram.com/denise_alesi'},
    {_key: 'youtube', _type: 'socialItem', nome: 'YouTube', url: 'https://www.youtube.com/channel/UCMWKycyJwLHJlgrPcHMn6zw/featured'},
  ],
}

function descriptionParagraphs(translation) {
  const text = translation.descrizione?.trim()
  if (!text) return []

  const paragraphs = text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)

  // Il documento cliente chiede una presentazione breve dell'edizione spagnola.
  // Il testo integrale rimane nel campo storico, quindi non viene perso.
  return translation.titolo === 'Más allá de lo conocido' ? paragraphs.slice(0, 1) : paragraphs
}

function toPortableText(translation, translationIndex) {
  return descriptionParagraphs(translation).map((paragraph, paragraphIndex) => ({
    _key: `paragraph-${translationIndex}-${paragraphIndex}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{
      _key: `span-${translationIndex}-${paragraphIndex}`,
      _type: 'span',
      marks: [],
      text: paragraph,
    }],
  }))
}

const documents = await client.fetch(`*[_type in ["opera", "galleriaFotografica", "video"]]{
  _id,
  _type,
  traduzioni
}`)

const updates = documents.flatMap((document) => {
  let changed = false
  const translations = document.traduzioni?.map((translation, translationIndex) => {
    if (translation.descrizioneRichText?.length || !translation.descrizione?.trim()) return translation

    changed = true
    return {
      ...translation,
      descrizioneRichText: toPortableText(translation, translationIndex),
    }
  })

  return changed ? [{...document, translations}] : []
})

const existingContacts = await client.fetch(`*[_id == "contatti"][0]{_id}`)
const shortenedSpanishDescription = updates.some(({translations}) => translations.some(
  (translation) => translation.titolo === 'Más allá de lo conocido' && translation.descrizioneRichText?.length === 1,
))

console.table(updates.map((document) => ({
  documento: document._id,
  tipo: document._type,
  descrizioniConvertite: document.translations.filter((translation) => translation.descrizioneRichText?.length).length,
})))
console.log(`Documenti da aggiornare: ${updates.length}`)
console.log(`Contatti: ${existingContacts ? 'già presenti' : 'da creare'}`)
console.log(`Descrizione breve di “Más allá de lo conocido”: ${shortenedSpanishDescription ? 'preparata' : 'già presente o non trovata'}`)

if (!execute) {
  console.log('Analisi completata. Usa --execute per applicare le modifiche.')
  process.exit(0)
}

let transaction = client.transaction().createIfNotExists(contacts)

for (const document of updates) {
  transaction = transaction.patch(document._id, {set: {traduzioni: document.translations}})
}

await transaction.commit({visibility: 'sync', tag: 'rich-text-and-contacts-migration'})
console.log('Descrizioni formattate e contatti pubblicati con successo.')
