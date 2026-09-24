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
  'La elección del número noventa y nueve, por lo que se refiere a las citas que dan vida en su sucesión a la narración de un viaje solitario – durante el que tienen lugar encuentros asombrosos – reside en la convicción de que la perfección es tal cuando no es portadora de la perfección misma y se puede entrar en ella sólo ofreciendo la propia contribución final con la elaboración subjetiva de la reflexión número cien, estimulada por la lectura de los anteriores enunciados.',
  'Denise Alesi tiene intención de animar el interés alrededor de temas imprescindibles para el crecimiento emotivo, dirigidos a la comprensión de los fenómenos del vivir, más allá de las creencias comunes. Se vale de un estilo de escritura conciso, directo, inmediato, con la intención de acceder a un público que ya está acostumbrado a la rapidez de la comunicación propia de la época contemporánea que - por su estructuración - no estimula el acercamiento a aquellas lecturas que requieren escandir el tiempo para profundizar en conceptos cuya elaboración es alimento para una conciencia propia. Con sequedad que caracteriza la fórmula del razonamiento, la narradora exhorta a aquellos que encuentran su escritura a tantear y profundizar en lo que ya está más allá del esquema de lo conocido: para alcanzar este objetivo, resulta necesaria una importante actividad de estudio y trabajo sobre la propia persona sostenido – en lo posible – por las enseñanzas de los grandes personajes que a su vez han indagado y han puesto en duda dogmas, para madurar consideraciones que analicen la entidad desde nuevas perspectivas.',
  'La reflexión número uno explicita inmediatamente el mensaje que se desarrolla en la composición, o sea que nadie puede sustituirse a nuestra persona a la hora de alcanzar los instrumentos que pueden llevar a la adquisición de mecanismos de razonamiento distintivos, planteados para la búsqueda del bien, alejados de tópicos y de un conocimientos exclusivamente hereditario. Cada uno debe poder llegar a alcanzar un día la capacidad de gobernarse a sí mismo, sus debilidades y retorcimientos de pensamiento; sólo de esta manera no será manipulable y se convertirá en un maestro también para los demás, mostrando coherencia entre acción y rectitud de la idea. Las noventa y nueve reflexiones viajan surcando los mares de la aventura de la vida, pidiéndole al lector su participación e implicación, con la esperanza de que pueda convertirse en autor del postulado final y llegar más allá de lo que sólo parece conocido.',
].join('\n\n')

const silenceDescription = 'Silenzio è un progetto artistico il quale, attraverso una successione di autoritratti fotografici, racconta un percorso di crescita individuale che trae origine dall’esperienza dell’inferno. L’affiorare di una maggiore consapevolezza conduce al purgatorio, dove ha luogo il processo evolutivo che consente infine di accedere alla conoscenza, dunque al paradiso, metafora della compiutezza del sé.'

const works = await client.fetch(`*[_type == "opera"]{
  _id,
  categoria,
  ordine,
  stato,
  immagine,
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

console.log('Aggiornamento opere:', workUpdates.map(([title, stato, ordine]) => ({title, stato, ordine})))
console.log('Edizione spagnola:', existingSpanishEdition ? 'da aggiornare' : 'da creare')
console.log('Video Silenzio:', 'da aggiornare con la descrizione')

if (!execute) {
  console.log('Analisi completata. Usa --execute per applicare le modifiche.')
  process.exit(0)
}

for (const [title, stato, ordine] of workUpdates) {
  const work = byTitle.get(title)
  await client.patch(work._id).set({stato, ordine}).commit()
}

const coverPath = path.resolve('migration/assets/mas-alla-de-lo-conocido.jpg')
if (!existsSync(coverPath)) throw new Error(`Copertina non trovata: ${coverPath}`)

const coverAsset = await client.assets.upload('image', createReadStream(coverPath), {
  filename: 'mas-alla-de-lo-conocido.jpg',
  contentType: 'image/jpeg',
})

const spanishEdition = {
  categoria: 'letteraria',
  stato: 'pubblicata',
  ordine: 30,
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
  }],
}

if (existingSpanishEdition) {
  await client.patch(existingSpanishEdition._id).set(spanishEdition).commit()
} else {
  await client.create({_type: 'opera', ...spanishEdition})
}

const videoTranslations = video.traduzioni?.length ? video.traduzioni.map((translation) => (
  translation.language === 'it' ? {...translation, descrizione: silenceDescription} : translation
)) : [{
  _key: 'it',
  _type: 'object',
  language: 'it',
  titolo: '“Silenzio” - Progetto artistico di Denise Alesi',
  descrizione: silenceDescription,
}]

await client.patch(video._id).set({traduzioni: videoTranslations}).commit()

console.log('Aggiornamento cliente applicato con successo.')
