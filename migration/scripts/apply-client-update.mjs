import {createReadStream, existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

function loadEnvironment() {
  for (const file of ['.env', '.env.local']) {
    if (!existsSync(file)) continue

    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
      if (!match || process.env[match[1]]) continue

      const value = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
      process.env[match[1]] = value
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
  apiVersion: '2026-09-24',
  useCdn: false,
})

const spanishDescription = [
  'Más allá de lo conocido es una colección que incluye noventa y nueve reflexiones de la autora Denise Alesi. Éstas proceden siguiendo un recorrido en el que la escritora no se limita a contar percepciones individuales, sino que asume el rol del científico que delante del microscopio observa causa y efecto de los fenómenos en busca de la intuición que permita acceder a la correcta ecuación, necesaria para su traducción. Temas recurrentes en este proceso de búsqueda son los de sufrimiento, condicionamiento del pensamiento, conciencia y realización de la propia misión en la configuración terrena.',
  'El camino que se emprende con la lectura de las reflexiones – aun permitiendo adentrarse en algunas de las cuestiones ancestrales que desestabilizan la armoniosa convivencia entre seres humanos – pretende llamar la atención en la belleza ínsita en el bien y en consecuencia en la renuncia del mal. El estudio de filosofía y sociología por parte de la autora, junto con el interés por la ciencia, el arte y la poesía encuentra múltiples conexiones con las vivencias personales o indirectamente con los acontecimientos que se entretejen y sobre los cuales ella se para a examinar, con los ojos de quien quiere comprender los comportamientos humanos y lo que se encuentra más allá del conocimiento personal.',
].join('\n\n')

const silenceDescription = 'Silenzio è un progetto artistico il quale, attraverso una successione di autoritratti fotografici, racconta un percorso di crescita individuale che trae origine dall’esperienza dell’inferno. L’affiorare di una maggiore consapevolezza, conduce al purgatorio dove ha luogo il processo evolutivo che consente, infine, di accedere alla conoscenza, dunque al paradiso (metafora della compiutezza del sé).'

function toPortableText(text, key = 'description') {
  return text.split(/\n\n+/).map((paragraph, index) => ({
    _key: `${key}-${index + 1}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: `${key}-${index + 1}-span`, _type: 'span', marks: [], text: paragraph}],
  }))
}

const works = await client.fetch(`*[_type == "opera"]{
  _id,
  categoria,
  ordine,
  stato,
  immagine,
  amazonUrl,
  amazonFormato,
  traduzioni
}`)

const titleOf = (work) => work.traduzioni?.find((translation) => translation.language === 'it')?.titolo
  || work.traduzioni?.find((translation) => translation.language === 'es')?.titolo
  || work.traduzioni?.[0]?.titolo

const byTitle = new Map(works.map((work) => [titleOf(work), work]))
const workUpdates = [
  ['Rivelazioni', 'pubblicata', 10],
  ['Al di là del conosciuto', 'pubblicata', 20],
  ['Evoluzione', 'pubblicata', 40],
  ['Poesia è la vita (work in progress)', 'nascosta', 80],
  ['My first roman (work in progress)', 'nascosta', 90],
  ['Silenzio', 'pubblicata', 40],
  ['Il Sogno e la Materia', 'pubblicata', 50],
  ['Firenze, tu', 'pubblicata', 60],
  ['Immagini e parole', 'pubblicata', 70],
]

for (const [title] of workUpdates) {
  if (!byTitle.has(title)) throw new Error(`Opera non trovata: ${title}`)
}

const existingSpanishEdition = works.find((work) => work.traduzioni?.some(
  (translation) => translation.titolo === 'Más allá de lo conocido',
))

const video = await client.fetch(`*[_type == "video" && url == $url][0]{_id, traduzioni}`, {
  url: 'https://www.youtube.com/watch?v=OmRxqa3OfiA',
})

if (!video) throw new Error('Video Silenzio non trovato.')

const galleries = await client.fetch(`*[_type == "galleriaFotografica"]{
  _id,
  traduzioni[]{language, titolo},
  "primaFotografia": fotografie[0]
}`)
const galleryTitleOf = (gallery) => gallery.traduzioni?.find((translation) => translation.language === 'it')?.titolo
  || gallery.traduzioni?.[0]?.titolo
const galleriesByTitle = new Map(galleries.map((gallery) => [galleryTitleOf(gallery), gallery]))
const galleryLinks = [
  ['Silenzio', 'Silenzio'],
  ['Il Sogno e la Materia', 'Il Sogno e la Materia'],
  ['Firenze, tu', 'Firenze, tu'],
  ['Immagini e parole', 'Immagini e parole'],
]

const lightsAndShadowsGallery = galleriesByTitle.get('Luci e ombre')
const lightsAndShadowsWork = byTitle.get('Luci e ombre')
if (!lightsAndShadowsGallery) throw new Error('Galleria non trovata: Luci e ombre')
if (!lightsAndShadowsGallery.primaFotografia?.asset?._ref) throw new Error('La galleria “Luci e ombre” non contiene fotografie.')

for (const [workTitle, galleryTitle] of galleryLinks) {
  if (!byTitle.has(workTitle)) throw new Error(`Opera non trovata: ${workTitle}`)
  if (!galleriesByTitle.has(galleryTitle)) throw new Error(`Galleria non trovata: ${galleryTitle}`)
}

console.log('Aggiornamento opere:', workUpdates.map(([title, stato, ordine]) => ({title, stato, ordine})))
console.log('Edizione spagnola:', existingSpanishEdition ? {
  azione: 'da aggiornare',
  amazonUrl: existingSpanishEdition.amazonUrl || 'non impostato',
  amazonFormato: existingSpanishEdition.amazonFormato || 'non impostato',
} : {azione: 'da creare', amazonUrl: 'non impostato'})
console.log('Video Silenzio:', 'da aggiornare con la descrizione')
console.log('Opera Luci e ombre:', lightsAndShadowsWork ? 'da aggiornare e collegare' : 'da creare e collegare')
console.log('Collegamenti gallerie:', galleryLinks.map(([opera, galleria]) => ({opera, galleria})))

if (!execute) {
  console.log('Analisi completata. Usa --execute per applicare le modifiche.')
  process.exit(0)
}

for (const [title, stato, ordine] of workUpdates) {
  const work = byTitle.get(title)
  await client.patch(work._id).set({stato, ordine}).commit()
}

for (const [workTitle, galleryTitle] of galleryLinks) {
  const work = byTitle.get(workTitle)
  const gallery = galleriesByTitle.get(galleryTitle)
  const fields = {galleriaCollegata: {_type: 'reference', _ref: gallery._id}}

  if (workTitle === 'Silenzio') {
    fields.videoCollegato = {_type: 'reference', _ref: video._id}
  }

  await client.patch(work._id).set(fields).commit()
}

const {_key: unusedPhotoKey, ...lightsAndShadowsImage} = lightsAndShadowsGallery.primaFotografia
void unusedPhotoKey
const lightsAndShadowsFields = {
  categoria: 'visiva',
  stato: 'pubblicata',
  ordine: 80,
  immagine: lightsAndShadowsImage,
  galleriaCollegata: {_type: 'reference', _ref: lightsAndShadowsGallery._id},
  traduzioni: lightsAndShadowsWork?.traduzioni?.length ? lightsAndShadowsWork.traduzioni : [{
    _key: 'it',
    _type: 'object',
    language: 'it',
    titolo: 'Luci e ombre',
  }],
}

if (lightsAndShadowsWork) {
  await client.patch(lightsAndShadowsWork._id).set(lightsAndShadowsFields).commit()
} else {
  await client.create({_type: 'opera', ...lightsAndShadowsFields})
}

const coverPath = path.resolve('migration/assets/mas-alla-de-lo-conocido.jpg')
if (!existsSync(coverPath)) throw new Error(`Copertina non trovata: ${coverPath}`)

const existingCoverRef = existingSpanishEdition?.immagine?.asset?._ref
const coverAsset = existingCoverRef ? {_id: existingCoverRef} : await client.assets.upload('image', createReadStream(coverPath), {
    filename: 'mas-alla-de-lo-conocido.jpg',
    contentType: 'image/jpeg',
  })

const spanishEdition = {
  categoria: 'letteraria',
  stato: 'pubblicata',
  ordine: 30,
  amazonUrl: 'https://amzn.eu/d/014xsOQX',
  amazonFormato: 'ebook',
  immagine: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'Copertina di Más allá de lo conocido',
  },
  traduzioni: [{
    _key: 'es',
    _type: 'object',
    language: 'es',
    titolo: 'Más allá de lo conocido',
    descrizione: spanishDescription,
    descrizioneRichText: toPortableText(spanishDescription, 'mas-alla-description'),
  }],
}

if (existingSpanishEdition) {
  await client.patch(existingSpanishEdition._id).set(spanishEdition).commit()
} else {
  await client.create({_type: 'opera', ...spanishEdition})
}

const videoTranslations = video.traduzioni?.length ? video.traduzioni.map((translation) => (
  translation.language === 'it'
    ? {...translation, descrizione: silenceDescription, descrizioneRichText: toPortableText(silenceDescription)}
    : translation
)) : [{
  _key: 'it',
  _type: 'object',
  language: 'it',
  titolo: '“Silenzio” - Progetto artistico di Denise Alesi',
  descrizione: silenceDescription,
  descrizioneRichText: toPortableText(silenceDescription),
}]

await client.patch(video._id).set({traduzioni: videoTranslations}).commit()

console.log('Aggiornamento cliente applicato con successo.')
