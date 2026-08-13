import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {Opera} from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const labels = {
  it: {title: 'Opere', intro: 'Scritti, immagini e tracce di una ricerca in continuo movimento.', empty: 'Nessuna opera pubblicata.'},
  en: {title: 'Works', intro: 'Writings, images and traces of an ever-evolving exploration.', empty: 'No published works yet.'},
  es: {title: 'Obras', intro: 'Escritos, imágenes y huellas de una búsqueda en movimiento.', empty: 'Todavía no hay obras publicadas.'},
} as const

export default async function OperePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const text = labels[lang as keyof typeof labels] || labels.it
  const opere: Opera[] = await client.fetch(`*[_type == "opera"] | order(ordine asc, anno desc, _id asc){
    _id, immagine, anno, ordine,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione)
  }`, {lang})

  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
    <header className="mx-auto mb-20 grid max-w-7xl gap-8 border-b border-black/20 pb-12 md:grid-cols-2 md:items-end">
      <h1 className="font-serif text-6xl tracking-[-0.04em] md:text-8xl">{text.title}</h1>
      <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#625d53] md:justify-self-end">{text.intro}</p>
    </header>
    {opere.length ? <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
      {opere.map((opera) => <Link key={opera._id} href={`/${lang}/opere/${opera._id}`} className="group flex h-full flex-col">
        <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-[#d8d0c2]">{opera.immagine && <Image src={urlFor(opera.immagine).width(900).height(1125).fit('crop').url()} alt={opera.titolo || 'Opera'} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />}</div>
        <div className="flex min-h-16 items-baseline justify-between gap-4 border-t border-black/20 pt-4"><h2 className="font-serif text-2xl">{opera.titolo}</h2>{opera.anno && <span className="text-[9px] tracking-widest text-black/45">{opera.anno}</span>}</div>
      </Link>)}
    </div> : <p className="mx-auto max-w-7xl font-serif text-2xl italic text-black/45">{text.empty}</p>}
  </div>
}
