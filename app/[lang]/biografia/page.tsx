import AboutView from '@/components/AboutView'
import {client} from '@/sanity/lib/client'
import type {About} from '@/types'
import type {Metadata} from 'next'
import {defineQuery} from 'next-sanity'
import {notFound} from 'next/navigation'

const BIOGRAPHY_QUERY = defineQuery(`
  *[_id == "about"][0]{
    "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo),
    "biografia": coalesce(traduzioni[language == $lang][0].biografia, traduzioni[language == "it"][0].biografia),
    foto,
    sfondo
  }
`)

async function getBiography(lang: string): Promise<About | null> {
  return client.fetch(BIOGRAPHY_QUERY, {lang})
}

export const metadata: Metadata = {
  title: 'Biografia | Denise Alesi',
  description: 'La biografia e il percorso artistico e letterario di Denise Alesi.',
}

export default async function BiographyPage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const biography = await getBiography(lang)
  if (!biography) notFound()

  return <main className="relative min-h-screen bg-[#1c1d26] text-white selection:bg-blue-500/30">
    <AboutView aboutData={biography} lang={lang} />
  </main>
}
