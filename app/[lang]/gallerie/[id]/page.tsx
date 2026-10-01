import PhotoGalleryGrid from '@/components/PhotoGalleryGrid'
import RichText from '@/components/RichText'
import {client} from '@/sanity/lib/client'
import type {GalleriaFotografica} from '@/types'
import {toPlainText} from '@portabletext/react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

type Props = {params: Promise<{id: string; lang: string}>}

async function getGallery(id: string, lang: string): Promise<GalleriaFotografica | null> {
  return client.fetch(`*[_type == "galleriaFotografica" && _id == $id][0]{
    _id, data, fotografie,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "descrizione": coalesce(traduzioni[language == $lang][0].descrizioneRichText, traduzioni[language == "it"][0].descrizioneRichText, traduzioni[0].descrizioneRichText),
    "descrizioneTesto": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione)
  }`, {id, lang})
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, lang} = await params
  const gallery = await getGallery(id, lang)
  return gallery ? {title: `${gallery.titolo} | Denise Alesi`, description: gallery.descrizioneTesto || (gallery.descrizione ? toPlainText(gallery.descrizione) : undefined)} : {title: 'Galleria non trovata'}
}

export default async function GalleryPage({params}: Props) {
  const {id, lang} = await params
  const gallery = await getGallery(id, lang)
  if (!gallery) notFound()
  const hasDescription = Boolean(gallery.descrizione?.length || gallery.descrizioneTesto)

  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-28 text-[#20231f] md:px-12 md:pt-32">
    <header className="mx-auto mb-10 max-w-7xl border-b border-black/20 pb-10">
      <Link href={`/${lang}/gallerie`} className="mb-10 inline-block text-[10px] uppercase tracking-[0.24em] text-black/45">← {lang === 'en' ? 'Galleries' : lang === 'es' ? 'Galerías' : 'Gallerie'}</Link>
      <h1 className="max-w-4xl font-serif text-5xl tracking-[-0.04em] md:text-8xl">{gallery.titolo}</h1>
    </header>
    <main className={`mx-auto max-w-7xl ${hasDescription ? 'grid items-start gap-10 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-16' : ''}`}>
      {hasDescription ? <aside className="lg:sticky lg:top-28">
        {gallery.descrizione?.length ? <RichText value={gallery.descrizione} className="text-[#625d53]" /> : <p className="body-copy whitespace-pre-line text-[#625d53]">{gallery.descrizioneTesto}</p>}
      </aside> : null}
      <PhotoGalleryGrid fotografie={gallery.fotografie || []} compact={hasDescription} />
    </main>
  </div>
}
