import {getYouTubeThumbnail} from '@/lib/video'
import {client} from '@/sanity/lib/client'
import type {Video} from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import {defineQuery} from 'next-sanity'

const OTHER_VIDEOS_QUERY = defineQuery(`
  *[_type == "video" && _id != $currentId] | order(inEvidenza desc, data desc)[0...3]{
    _id,
    url,
    "titolo": coalesce(
      traduzioni[language == $lang][0].titolo,
      traduzioni[language == "it"][0].titolo,
      traduzioni[0].titolo,
      titolo
    )
  }
`)

export default async function AltriVideo({currentId, lang}: {currentId: string; lang: string}) {
  const videos = await client.fetch<Video[]>(OTHER_VIDEOS_QUERY, {currentId, lang})
  if (!videos.length) return null
  const title = lang === 'en' ? 'More videos' : lang === 'es' ? 'Otros vídeos' : 'Altri video'
  const all = lang === 'en' ? 'All videos' : lang === 'es' ? 'Todos los vídeos' : 'Tutti i video'

  return <section className="mt-28 border-t border-white/15 pt-12">
    <div className="mb-10 flex items-end justify-between gap-6">
      <h2 className="font-serif text-3xl">{title}</h2>
      <Link href={`/${lang}/video`} className="text-[9px] uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-[#c5a46d]">{all} →</Link>
    </div>
    <div className="grid gap-8 md:grid-cols-3">
      {videos.map((video) => {
        const thumbnail = getYouTubeThumbnail(video.url)
        return <Link key={video._id} href={`/${lang}/video/${video._id}`} className="group block">
          <div className="relative aspect-video overflow-hidden bg-black/30">
            {thumbnail && <Image src={thumbnail} alt={video.titolo} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-100" />}
          </div>
          <h3 className="mt-4 border-t border-white/15 pt-4 font-serif text-xl transition-colors group-hover:text-[#c5a46d]">{video.titolo}</h3>
        </Link>
      })}
    </div>
  </section>
}
