import AltriVideo from '@/components/AltriVideo'
import RichText from '@/components/RichText'
import {getVideoEmbedUrl} from '@/lib/video'
import {client} from '@/sanity/lib/client'
import type {Video} from '@/types'
import {toPlainText} from '@portabletext/react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound, permanentRedirect} from 'next/navigation'
import {defineQuery} from 'next-sanity'

type Props = {
  params: Promise<{id: string; lang: string}>
  searchParams: Promise<{from?: string}>
}

const VIDEO_QUERY = defineQuery(`
  *[_type == "video" && (_id == $id || slug.current == $id)][0]{
    _id,
    "slug": slug.current,
    data,
    url,
    "titolo": coalesce(
      traduzioni[language == $lang][0].titolo,
      traduzioni[language == "it"][0].titolo,
      traduzioni[0].titolo,
      titolo
    ),
    "descrizione": coalesce(
      traduzioni[language == $lang][0].descrizioneRichText,
      traduzioni[language == "it"][0].descrizioneRichText,
      traduzioni[0].descrizioneRichText
    ),
    "descrizioneTesto": coalesce(
      traduzioni[language == $lang][0].descrizione,
      traduzioni[language == "it"][0].descrizione,
      traduzioni[0].descrizione
    )
  }
`)

async function getVideo(id: string, lang: string) {
  return client.fetch<Video | null>(VIDEO_QUERY, {id, lang})
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, lang} = await params
  const video = await getVideo(id, lang)
  return video ? {title: `${video.titolo} | Denise Alesi`, description: video.descrizioneTesto || (video.descrizione ? toPlainText(video.descrizione) : undefined)} : {title: 'Video non trovato'}
}

export default async function VideoDetailPage({params, searchParams}: Props) {
  const {id, lang} = await params
  const {from} = await searchParams
  const fromVisualWorks = from === 'opere-visive'
  const video = await getVideo(id, lang)
  if (!video) notFound()
  if (video.slug && id !== video.slug) permanentRedirect(`/${lang}/video/${video.slug}${fromVisualWorks ? '?from=opere-visive' : ''}`)
  const embedUrl = getVideoEmbedUrl(video.url)
  const archiveLabel = lang === 'en' ? 'Back to visual works' : lang === 'es' ? 'Volver a las obras visuales' : 'Torna alle opere visive'

  return <main className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-20 text-[#20231f] md:px-12 md:pt-20">
    <div className="mx-auto max-w-7xl">
      {fromVisualWorks ? <Link href={`/${lang}/opere-visive`} className="mb-5 inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-black/45 transition-colors hover:text-black">← {archiveLabel}</Link> : null}
      <header className="mb-5 border-b border-black/20 pb-5">
        <h1 className="max-w-5xl font-serif text-3xl leading-[1.05] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
          {video.titolo}
        </h1>
      </header>

      <div className={`grid items-start gap-10 ${video.descrizione?.length || video.descrizioneTesto ? 'lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.7fr)]' : ''}`}>
        {embedUrl ? <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_35px_100px_rgba(0,0,0,0.35)]">
          <iframe className="h-full w-full" src={embedUrl} title={video.titolo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div> : <a href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 border-b border-[#8a704b] pb-2 text-sm uppercase tracking-[0.2em]">Apri il video originale →</a>}
        {video.descrizione?.length ? <RichText value={video.descrizione} className="border-t border-black/15 pt-6 text-[#625d53] lg:border-t-0 lg:pt-8" /> : video.descrizioneTesto ? <p className="body-copy whitespace-pre-line border-t border-black/15 pt-6 text-[#625d53] lg:border-t-0 lg:pt-8">{video.descrizioneTesto}</p> : null}
      </div>

      <AltriVideo currentId={video._id} lang={lang} />
    </div>
  </main>
}
