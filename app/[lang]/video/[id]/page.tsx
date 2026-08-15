import AltriVideo from '@/components/AltriVideo'
import {getVideoEmbedUrl} from '@/lib/video'
import {client} from '@/sanity/lib/client'
import type {Video} from '@/types'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {defineQuery} from 'next-sanity'

type Props = {params: Promise<{id: string; lang: string}>}

const VIDEO_QUERY = defineQuery(`
  *[_type == "video" && _id == $id][0]{
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

async function getVideo(id: string, lang: string) {
  return client.fetch<Video | null>(VIDEO_QUERY, {id, lang})
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, lang} = await params
  const video = await getVideo(id, lang)
  return video ? {title: `${video.titolo} | Denise Alesi`} : {title: 'Video non trovato'}
}

export default async function VideoDetailPage({params}: Props) {
  const {id, lang} = await params
  const video = await getVideo(id, lang)
  if (!video) notFound()
  const embedUrl = getVideoEmbedUrl(video.url)
  const archiveLabel = lang === 'en' ? 'All videos' : lang === 'es' ? 'Todos los vídeos' : 'Tutti i video'

  return <main className="min-h-screen bg-[#20251f] px-6 pb-28 pt-36 text-[#eee8dc] md:px-12 md:pt-44">
    <div className="mx-auto max-w-7xl">
      <Link href={`/${lang}/video`} className="mb-12 inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-[#c5a46d]">← {archiveLabel}</Link>
      <header className="mb-12 grid gap-8 border-b border-white/15 pb-10 md:grid-cols-[1fr_auto] md:items-end">
        <h1 className="max-w-5xl font-serif text-4xl leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">{video.titolo}</h1>
        {video.data && <time dateTime={video.data} className="text-[10px] uppercase tracking-[0.25em] text-[#c5a46d]">{new Intl.DateTimeFormat(lang, {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(`${video.data}T12:00:00Z`))}</time>}
      </header>

      {embedUrl ? <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_35px_100px_rgba(0,0,0,0.35)]">
        <iframe className="h-full w-full" src={embedUrl} title={video.titolo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div> : <a href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 border-b border-[#c5a46d] pb-2 text-sm uppercase tracking-[0.2em]">Apri il video originale →</a>}

      <AltriVideo currentId={id} lang={lang} />
    </div>
  </main>
}
