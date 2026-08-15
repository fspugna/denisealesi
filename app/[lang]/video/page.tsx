import {FadeIn} from '@/components/Animate'
import {getYouTubeThumbnail} from '@/lib/video'
import {client} from '@/sanity/lib/client'
import type {Video} from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import {defineQuery} from 'next-sanity'

const copy = {
  it: {title: 'Video', intro: 'Immagini in movimento, parole e progetti artistici.', empty: 'Nessun video pubblicato.', watch: 'Guarda il video'},
  en: {title: 'Videos', intro: 'Moving images, words and artistic projects.', empty: 'No videos published yet.', watch: 'Watch the video'},
  es: {title: 'Vídeos', intro: 'Imágenes en movimiento, palabras y proyectos artísticos.', empty: 'Todavía no hay vídeos publicados.', watch: 'Ver el vídeo'},
} as const

const VIDEOS_QUERY = defineQuery(`
  *[_type == "video"] | order(inEvidenza desc, data desc, _createdAt desc){
    _id,
    data,
    url,
    "titolo": coalesce(
      traduzioni[language == $lang][0].titolo,
      traduzioni[language == "it"][0].titolo,
      traduzioni[0].titolo,
      titolo
    )
  }
`)

export default async function VideosPage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const text = copy[language]
  const videos = await client.fetch<Video[]>(VIDEOS_QUERY, {lang: language})

  return <main className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
    <header className="mx-auto mb-20 grid max-w-7xl gap-8 border-b border-black/20 pb-12 md:grid-cols-2 md:items-end">
      <div>
        <span className="mb-5 block text-[9px] uppercase tracking-[0.34em] text-black/40">Archivio audiovisivo</span>
        <h1 className="font-serif text-6xl tracking-[-0.05em] md:text-8xl">{text.title}</h1>
      </div>
      <p className="max-w-md font-serif text-xl italic leading-relaxed text-[#625d53] md:justify-self-end">{text.intro}</p>
    </header>

    {videos.length ? <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-16 md:grid-cols-2">
      {videos.map((video, index) => {
        const thumbnail = getYouTubeThumbnail(video.url)
        return <FadeIn key={video._id} delay={index * 0.1}>
          <Link href={`/${language}/video/${video._id}`} className="group block">
            <div className="relative aspect-video overflow-hidden bg-[#20251f]">
              {thumbnail ? <Image src={thumbnail} alt={video.titolo} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-5 right-5 flex size-14 items-center justify-center rounded-full border border-white/60 bg-black/15 text-lg text-white backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-[#c5a46d] group-hover:text-[#20231f]">▶</span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-6 border-t border-black/20 pt-5">
              <div>
                <h2 className="max-w-2xl font-serif text-2xl leading-tight md:text-3xl">{video.titolo}</h2>
                <span className="mt-4 inline-block text-[9px] uppercase tracking-[0.28em] text-black/45">{text.watch} →</span>
              </div>
              {video.data && <time dateTime={video.data} className="shrink-0 text-[9px] tracking-widest text-black/45">{new Date(`${video.data}T12:00:00`).getFullYear()}</time>}
            </div>
          </Link>
        </FadeIn>
      })}
    </div> : <p className="mx-auto max-w-7xl font-serif text-2xl italic text-black/45">{text.empty}</p>}
  </main>
}
