import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {GalleriaFotografica} from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import {defineQuery} from 'next-sanity'

const labels = {
  it: {title: 'Gallerie', intro: 'Immagini, luoghi e frammenti raccolti attraverso lo sguardo.', empty: 'Nessuna galleria pubblicata.'},
  en: {title: 'Galleries', intro: 'Images, places and fragments gathered through the gaze.', empty: 'No galleries published yet.'},
  es: {title: 'Galerías', intro: 'Imágenes, lugares y fragmentos reunidos a través de la mirada.', empty: 'Todavía no hay galerías publicadas.'},
} as const

const GALLERIES_QUERY = defineQuery(/* groq */ `
  *[_type == "galleriaFotografica"]
    | order(defined(orderRank) desc, orderRank asc, data asc, _createdAt asc){
      _id,
      "slug": slug.current,
      orderRank,
      data,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
      "copertina": coalesce(copertina, fotografie[0])
    }
`)

export default async function GalleriePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const text = labels[lang as keyof typeof labels] || labels.it
  const gallerie = await client.fetch<GalleriaFotografica[]>(GALLERIES_QUERY, {lang})

  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-20 text-[#20231f] md:px-12 md:pt-20">
    <header className="mx-auto mb-12 grid max-w-7xl gap-6 border-b border-black/20 pb-8 md:grid-cols-2 md:items-end">
      <h1 className="font-serif text-4xl tracking-[-0.04em] md:text-6xl">{text.title}</h1>
      <p className="body-copy max-w-md italic text-[#625d53] md:justify-self-end">{text.intro}</p>
    </header>
    {gallerie.length ? <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-16 md:grid-cols-2">
      {gallerie.map((galleria) => <Link key={galleria._id} href={`/${lang}/gallerie/${galleria.slug || galleria._id}`} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden bg-[#d8d0c2]">{galleria.copertina && <Image src={urlFor(galleria.copertina).width(1200).height(800).fit('crop').url()} alt={galleria.copertina.alt || galleria.titolo} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />}</div>
        <div className="mt-5 flex items-baseline justify-between gap-5 border-t border-black/20 pt-4"><h2 className="font-serif text-2xl">{galleria.titolo}</h2><time className="text-[9px] tracking-widest text-black/45">{galleria.data ? new Date(galleria.data).getFullYear() : ''}</time></div>
      </Link>)}
    </div> : <p className="mx-auto max-w-7xl font-serif text-2xl italic text-black/45">{text.empty}</p>}
  </div>
}
