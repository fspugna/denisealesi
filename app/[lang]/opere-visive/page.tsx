import {FadeIn} from '@/components/Animate'
import OperaGrid from '@/components/OperaGrid'
import {getYouTubeThumbnail} from '@/lib/video'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {GalleriaFotografica, Opera, Video} from '@/types'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {defineQuery} from 'next-sanity'

type VisualWorksData = {
  opere: Opera[]
  gallerie: GalleriaFotografica[]
  video: Video[]
}

const copy = {
  it: {title: 'Opere visive', eyebrow: 'Immagine', intro: 'Fotografia, autoritratto e immagini in movimento come forme di ricerca e racconto.', works: 'Progetti visivi', galleries: 'Gallerie', videos: 'Video', allGalleries: 'Tutte le gallerie', allVideos: 'Tutti i video', empty: 'Nessun progetto visivo pubblicato.'},
  en: {title: 'Visual works', eyebrow: 'Image', intro: 'Photography, self-portraiture and moving images as forms of exploration and storytelling.', works: 'Visual projects', galleries: 'Galleries', videos: 'Videos', allGalleries: 'All galleries', allVideos: 'All videos', empty: 'No visual projects published yet.'},
  es: {title: 'Obras visuales', eyebrow: 'Imagen', intro: 'Fotografía, autorretrato e imágenes en movimiento como formas de investigación y relato.', works: 'Proyectos visuales', galleries: 'Galerías', videos: 'Vídeos', allGalleries: 'Todas las galerías', allVideos: 'Todos los vídeos', empty: 'Todavía no hay proyectos visuales publicados.'},
} as const

const VISUAL_WORKS_QUERY = defineQuery(/* groq */ `{
  "opere": *[_type == "opera" && categoria == "visiva" && (!defined(stato) || stato == "pubblicata")] | order(ordine asc, anno desc, _id asc){
    _id,
    categoria,
    immagine,
    anno,
    ordine,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo)
  },
  "gallerie": *[_type == "galleriaFotografica"] | order(defined(orderRank) desc, orderRank asc, data asc, _createdAt asc)[0...2]{
    _id,
    orderRank,
    data,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "fotografie": fotografie[0...1]
  },
  "video": *[_type == "video"] | order(inEvidenza desc, data desc, _createdAt desc)[0...2]{
    _id,
    data,
    url,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo, titolo)
  }
}`)

export const metadata: Metadata = {
  title: 'Opere visive | Denise Alesi',
  description: 'Fotografia, autoritratto e video di Denise Alesi.',
}

export default async function OpereVisivePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const text = copy[language]
  const data = await client.fetch<VisualWorksData>(VISUAL_WORKS_QUERY, {lang: language})

  return (
    <main className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
      <header className="mx-auto mb-20 grid max-w-7xl gap-8 border-b border-black/20 pb-12 md:grid-cols-2 md:items-end">
        <div>
          <span className="mb-5 block text-[9px] uppercase tracking-[0.34em] text-black/40">{text.eyebrow}</span>
          <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-8xl">{text.title}</h1>
        </div>
        <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#625d53] md:justify-self-end">{text.intro}</p>
      </header>

      <section className="mx-auto max-w-7xl">
        <h2 className="mb-10 border-b border-black/20 pb-5 font-serif text-4xl">{text.works}</h2>
        {data.opere.length ? <OperaGrid opere={data.opere} lang={language} /> : <p className="font-serif text-2xl italic text-black/45">{text.empty}</p>}
      </section>

      {data.gallerie.length ? (
        <section className="mx-auto mt-28 max-w-7xl">
          <div className="mb-10 flex items-end justify-between border-b border-black/20 pb-5">
            <h2 className="font-serif text-4xl">{text.galleries}</h2>
            <Link href={`/${language}/gallerie`} className="text-[9px] uppercase tracking-[0.24em] text-black/50 hover:text-black">{text.allGalleries} →</Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {data.gallerie.map((galleria) => (
              <Link key={galleria._id} href={`/${language}/gallerie/${galleria._id}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-[#d8d0c2]">
                  {galleria.fotografie?.[0] ? <Image src={urlFor(galleria.fotografie[0]).width(1200).height(800).fit('crop').url()} alt={galleria.fotografie[0].alt || galleria.titolo} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" /> : null}
                </div>
                <h3 className="mt-5 border-t border-black/20 pt-4 font-serif text-3xl">{galleria.titolo}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {data.video.length ? (
        <section className="mx-auto mt-28 max-w-7xl">
          <div className="mb-10 flex items-end justify-between border-b border-black/20 pb-5">
            <h2 className="font-serif text-4xl">{text.videos}</h2>
            <Link href={`/${language}/video`} className="text-[9px] uppercase tracking-[0.24em] text-black/50 hover:text-black">{text.allVideos} →</Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {data.video.map((video, index) => {
              const thumbnail = getYouTubeThumbnail(video.url)
              return <FadeIn key={video._id} delay={index * 0.1}>
                <Link href={`/${language}/video/${video._id}`} className="group block">
                  <div className="relative aspect-video overflow-hidden bg-[#20251f]">
                    {thumbnail ? <Image src={thumbnail} alt={video.titolo} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100" /> : null}
                    <span className="absolute bottom-5 right-5 flex size-14 items-center justify-center rounded-full border border-white/60 bg-black/15 text-lg text-white backdrop-blur-sm">▶</span>
                  </div>
                  <h3 className="mt-5 border-t border-black/20 pt-4 font-serif text-3xl">{video.titolo}</h3>
                </Link>
              </FadeIn>
            })}
          </div>
        </section>
      ) : null}
    </main>
  )
}
