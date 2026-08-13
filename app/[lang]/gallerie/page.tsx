import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {GalleriaFotografica} from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const labels = {
  it: {title: 'Gallerie fotografiche', intro: 'Immagini, luoghi e frammenti raccolti attraverso lo sguardo.', empty: 'Nessuna galleria pubblicata.'},
  en: {title: 'Photo galleries', intro: 'Images, places and fragments gathered through the gaze.', empty: 'No galleries published yet.'},
  es: {title: 'Galerías fotográficas', intro: 'Imágenes, lugares y fragmentos reunidos a través de la mirada.', empty: 'Todavía no hay galerías publicadas.'},
} as const

export default async function GalleriePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const text = labels[lang as keyof typeof labels] || labels.it
  const gallerie: GalleriaFotografica[] = await client.fetch(`*[_type == "galleriaFotografica"] | order(data desc, _createdAt desc){
    _id, data, "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione),
    "fotografie": fotografie[0...1]
  }`, {lang})

  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
    <header className="mx-auto mb-20 grid max-w-7xl gap-8 border-b border-black/20 pb-12 md:grid-cols-2 md:items-end">
      <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-8xl">{text.title}</h1>
      <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#625d53] md:justify-self-end">{text.intro}</p>
    </header>
    {gallerie.length ? <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-16 md:grid-cols-2">
      {gallerie.map((galleria) => <Link key={galleria._id} href={`/${lang}/gallerie/${galleria._id}`} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden bg-[#d8d0c2]">{galleria.fotografie?.[0] && <Image src={urlFor(galleria.fotografie[0]).width(1200).height(800).fit('crop').url()} alt={galleria.fotografie[0].alt || galleria.titolo} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />}</div>
        <div className="mt-5 flex items-baseline justify-between gap-5 border-t border-black/20 pt-4"><h2 className="font-serif text-3xl">{galleria.titolo}</h2><time className="text-[9px] tracking-widest text-black/45">{galleria.data ? new Date(galleria.data).getFullYear() : ''}</time></div>
      </Link>)}
    </div> : <p className="mx-auto max-w-7xl font-serif text-2xl italic text-black/45">{text.empty}</p>}
  </div>
}
