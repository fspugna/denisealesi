import PhotoGalleryGrid from '@/components/PhotoGalleryGrid'
import RichText from '@/components/RichText'
import {client} from '@/sanity/lib/client'
import type {GalleriaFotografica} from '@/types'
import {toPlainText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

type Props = {params: Promise<{id: string; lang: string}>}

function stripLeadingDescriptionTitle(blocks: PortableTextBlock[] | undefined, title: string | undefined) {
  if (!blocks?.length || !title) return blocks

  const [firstBlock, ...remainingBlocks] = blocks
  if (firstBlock._type !== 'block' || !firstBlock.children.length) return blocks

  const [firstChild, ...remainingChildren] = firstBlock.children
  if (firstChild._type !== 'span' || !firstChild.text.startsWith(title)) return blocks

  const text = firstChild.text.slice(title.length).replace(/^\s+/, '')
  return [{...firstBlock, children: [{...firstChild, text}, ...remainingChildren]}, ...remainingBlocks]
}

async function getGallery(id: string, lang: string): Promise<GalleriaFotografica | null> {
  return client.fetch(`*[_type == "galleriaFotografica" && _id == $id][0]{
    _id, data, fotografie,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "titoloDescrizione": coalesce(traduzioni[language == $lang][0].titoloDescrizione, traduzioni[language == "it"][0].titoloDescrizione, traduzioni[0].titoloDescrizione),
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
  const description = stripLeadingDescriptionTitle(gallery.descrizione, gallery.titoloDescrizione)
  const hasDescription = Boolean(gallery.titoloDescrizione || description?.length || gallery.descrizioneTesto)

  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-28 pt-24 text-[#20231f] md:px-12 md:pt-28">
    <header className="mx-auto mb-8 max-w-7xl border-b border-black/20 pb-8">
      <Link href={`/${lang}/gallerie`} className="mb-7 inline-block text-[10px] uppercase tracking-[0.24em] text-black/45">← {lang === 'en' ? 'Galleries' : lang === 'es' ? 'Galerías' : 'Gallerie'}</Link>
      <h1 className="max-w-4xl font-serif text-4xl tracking-[-0.04em] md:text-6xl">{gallery.titolo}</h1>
    </header>
    <main className={`mx-auto max-w-7xl ${hasDescription ? 'grid items-start gap-10 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-16' : ''}`}>
      {hasDescription ? <aside className="lg:sticky lg:top-28">
        {gallery.titoloDescrizione ? <h2 className="mb-4 font-serif text-2xl leading-tight text-[#20231f] md:text-3xl">{gallery.titoloDescrizione}</h2> : null}
        {description?.length ? <RichText value={description} className="text-[#625d53]" /> : gallery.descrizioneTesto ? <p className="body-copy whitespace-pre-line text-[#625d53]">{gallery.descrizioneTesto}</p> : null}
      </aside> : null}
      <PhotoGalleryGrid fotografie={gallery.fotografie || []} compact={hasDescription} />
    </main>
  </div>
}
