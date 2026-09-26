import AmazonBadge from '@/components/AmazonBadge'
import OperaGrid from '@/components/OperaGrid'
import {client} from '@/sanity/lib/client'
import type {Opera} from '@/types'
import type {Metadata} from 'next'
import {defineQuery} from 'next-sanity'

const copy = {
  it: {title: 'Opere letterarie', eyebrow: 'Scrittura', intro: 'Libri, poesie e progetti narrativi nati dall’osservazione del vissuto.', empty: 'Nessuna opera letteraria pubblicata.'},
  en: {title: 'Literary works', eyebrow: 'Writing', intro: 'Books, poetry and narrative projects born from observing lived experience.', empty: 'No literary works published yet.'},
  es: {title: 'Obras literarias', eyebrow: 'Escritura', intro: 'Libros, poesía y proyectos narrativos nacidos de la observación de la experiencia.', empty: 'Todavía no hay obras literarias publicadas.'},
} as const

const amazonBadgeUrl = 'https://www.amazon.it/s?k=denise+Alesi&__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_2'

const LITERARY_WORKS_QUERY = defineQuery(/* groq */ `
  *[_type == "opera" && categoria == "letteraria" && (!defined(stato) || stato == "pubblicata")] | order(ordine asc, anno desc, _id asc){
    _id,
    categoria,
    immagine,
    anno,
    ordine,
    "titolo": coalesce(
      traduzioni[language == $lang][0].titolo,
      traduzioni[language == "it"][0].titolo,
      traduzioni[0].titolo
    )
  }
`)

export const metadata: Metadata = {
  title: 'Opere letterarie | Denise Alesi',
  description: 'Libri, poesie e progetti narrativi di Denise Alesi.',
}

export default async function OpereLetterariePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const text = copy[language]
  const opere = await client.fetch<Opera[]>(LITERARY_WORKS_QUERY, {lang: language})

  return (
    <main className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
      <header className="mx-auto mb-20 grid max-w-7xl gap-8 border-b border-black/20 pb-12 md:grid-cols-2 md:items-end">
        <div>
          <span className="mb-5 block text-[9px] uppercase tracking-[0.34em] text-black/40">{text.eyebrow}</span>
          <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-8xl">{text.title}</h1>
        </div>
        <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#625d53] md:justify-self-end">{text.intro}</p>
      </header>
      <div className="mx-auto max-w-7xl">
        {opere.length ? <OperaGrid opere={opere} lang={language} /> : <p className="font-serif text-2xl italic text-black/45">{text.empty}</p>}
        <div className="mt-20 flex justify-center border-t border-black/15 pt-10">
          <AmazonBadge href={amazonBadgeUrl} lang={language} />
        </div>
      </div>
    </main>
  )
}
