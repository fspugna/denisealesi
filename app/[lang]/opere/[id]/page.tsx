import OperaDetailView from '@/components/OperaDetailView'
import {client} from '@/sanity/lib/client'
import type {Opera} from '@/types'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

type Props = {params: Promise<{id: string; lang: string}>}

async function getOpera(id: string, lang: string): Promise<Opera | null> {
  return client.fetch(`*[_type == "opera" && _id == $id][0]{
    _id, immagine, anno, amazonUrl,
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
    "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione),
    "audio": coalesce(traduzioni[language == $lang][0].audio, traduzioni[language == "it"][0].audio, audio){titolo, asset->{url}},
    "galleriaCollegata": galleriaCollegata->{
      _id,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo)
    },
    "videoCollegato": videoCollegato->{
      _id,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo)
    }
  }`, {id, lang})
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id, lang} = await params
  const opera = await getOpera(id, lang)
  return opera ? {title: `${opera.titolo} | Denise Alesi`, description: opera.descrizione} : {title: 'Opera non trovata'}
}

export default async function OperaPage({params}: Props) {
  const {id, lang} = await params
  const opera = await getOpera(id, lang)
  if (!opera) notFound()
  return <div className="min-h-screen bg-[#eee8dc] px-6 pb-24 pt-36 text-[#20231f] md:px-12 md:pt-44"><div className="mx-auto max-w-6xl"><OperaDetailView opera={opera} /></div></div>
}
