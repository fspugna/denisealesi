import PhotoGalleryGrid from '@/components/PhotoGalleryGrid'
import {client} from '@/sanity/lib/client'
import type {GalleriaFotografica} from '@/types'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

type Props = {params: Promise<{id: string; lang: string}>}

async function getGallery(id: string, lang: string): Promise<GalleriaFotografica | null> {
  return client.fetch(`*[_type == "galleriaFotografica" && _id == $id][0]{
    _id, data, fotografie,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione)
  }`, {id, lang})
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, lang} = await params
  const gallery = await getGallery(id, lang)
  return gallery ? {title: `${gallery.titolo} | Denise Alesi`, description: gallery.descrizione} : {title: 'Galleria non trovata'}
}

export default async function GalleryPage({params}: Props) {
  const {id, lang} = await params
  const gallery = await getGallery(id, lang)
  if (!gallery) notFound()
  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-36 text-[#20231f] md:px-12 md:pt-44">
    <header className="mx-auto mb-16 max-w-7xl border-b border-black/20 pb-12">
      <Link href={`/${lang}/gallerie`} className="mb-10 inline-block text-[10px] uppercase tracking-[0.24em] text-black/45">← {lang === 'en' ? 'Photo galleries' : lang === 'es' ? 'Galerías fotográficas' : 'Gallerie fotografiche'}</Link>
      <h1 className="max-w-4xl font-serif text-5xl tracking-[-0.04em] md:text-8xl">{gallery.titolo}</h1>
      {gallery.descrizione && <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-[#625d53]">{gallery.descrizione}</p>}
    </header>
    <main className="mx-auto max-w-7xl"><PhotoGalleryGrid fotografie={gallery.fotografie || []} /></main>
  </div>
}
