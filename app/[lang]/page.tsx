import {FadeIn, FadeUp} from '@/components/Animate'
import ContactsView from '@/components/ContactsView'
import {withContactFallback} from '@/lib/contacts'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {Contatti, Header, Opera} from '@/types'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import {defineQuery} from 'next-sanity'

type HomePageData = {
  header: Header | null
  opere: Opera[]
  contatti: Contatti | null
}

const copy = {
  it: {role: 'Autrice · artista visiva', works: 'Opere', allWorks: 'Tutte le opere', biography: 'Biografia', read: 'Leggi la biografia'},
  en: {role: 'Author · visual artist', works: 'Works', allWorks: 'All works', biography: 'Biography', read: 'Read the biography'},
  es: {role: 'Autora · artista visual', works: 'Obras', allWorks: 'Todas las obras', biography: 'Biografía', read: 'Leer la biografía'},
} as const

const HOME_QUERY = defineQuery(`{
    "header": *[_id == "header"][0]{
      ritratto,
      "citazione": coalesce(traduzioni[language == $lang][0].citazione, traduzioni[language == "it"][0].citazione),
      "operaInEvidenza": operaInEvidenza{
        immagine,
        "didascalia": coalesce(traduzioni[language == $lang][0].didascalia, traduzioni[language == "it"][0].didascalia),
        "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo),
        "sottotitolo": coalesce(traduzioni[language == $lang][0].sottotitolo, traduzioni[language == "it"][0].sottotitolo),
        "testo": coalesce(traduzioni[language == $lang][0].testo, traduzioni[language == "it"][0].testo)
      }
    },
    "opere": *[_type == "opera"] | order(_createdAt desc)[0...4]{
      _id, immagine, anno, ordine,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
      "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione)
    },
    "contatti": *[_id == "contatti"][0]{
      telefono,
      email,
      "fotoUrl": foto.asset->url,
      "fotoAlt": foto.alt,
      social[]{_key, nome, url}
    }
  }`)

async function getHomeData(lang: string): Promise<HomePageData> {
  return client.fetch<HomePageData>(HOME_QUERY, {lang})
}

export default async function Home({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const data = await getHomeData(lang)
  const text = copy[lang as keyof typeof copy] || copy.it
  const portrait = data.header?.ritratto
  const contacts = withContactFallback(data.contatti)

  return (
    <div className="overflow-hidden bg-[#eee8dc] text-[#20231f]">
      <section className="grid min-h-screen lg:grid-cols-2">
        <div className="relative min-h-[58vh] overflow-hidden bg-[#343a34] lg:min-h-screen">
          {portrait ? <Image src={urlFor(portrait).width(1400).height(1800).fit('crop').url()} alt={portrait.alt || 'Ritratto di Denise Alesi'} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center grayscale-[20%]" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <p className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[0.35em] text-white/65 md:left-10">Denise Alesi · Roma</p>
        </div>

        <div className="relative flex min-h-[72vh] flex-col justify-center px-7 py-20 sm:px-12 lg:min-h-screen lg:px-[10vw] lg:py-16">
          <span className="mb-6 text-[10px] uppercase tracking-[0.34em] text-[#766e60]">{text.role}</span>
          <FadeUp>
            <h1 className="font-serif text-[clamp(3.5rem,6vw,6.8rem)] leading-[0.82] tracking-[-0.05em]">Denise<br/><em className="font-normal">Alesi</em></h1>
          </FadeUp>
          <div className="my-6 h-px w-16 bg-[#9e835c]" />
          <FadeUp delay={0.15}>
            <div className="max-w-2xl font-serif text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.65] text-[#4e4b43] [&_p+p]:mt-5 [&_p:last-child]:text-sm [&_p:last-child]:text-[#766e60]">
              {data.header?.citazione?.length ? <PortableText value={data.header.citazione} /> : <>
                <p>Non può esistere spazio tra ciò che fu, che è, e che sarà. Ogni accadimento assume le sembianze di ciò che crediamo, di ciò del quale abbiamo bisogno fosse anche dell’inferno. Solo quando la verità ha luogo è possibile scostare il velo che avvolge ogni pensiero, ogni immagine, allora tutto si trasforma, tutto accade. Il racconto crea la storia, nutre l&apos;immaginazione, contribuisce alla conoscenza di se stessi e delle cose. Si racconta con la parola, si racconta con le ombre, si racconta con la luce.</p>
                <p>(tratto da <em>Immagini e parole</em> di Denise Alesi)</p>
              </>}
            </div>
          </FadeUp>
          <FadeUp delay={0.3} className="mt-7">
            <Link
              href={`/${lang}/biografia`}
              className="group inline-flex items-center gap-5 text-[10px] uppercase tracking-[0.25em] text-[#625b50] transition-colors hover:text-[#20231f]"
              aria-label={text.read}
            >
              <span className="h-px w-10 bg-[#9e835c] transition-all duration-500 group-hover:w-16" />
              <span>{text.read}</span>
              <span className="flex size-9 items-center justify-center rounded-full border border-[#9e835c]/60 text-sm transition-all duration-300 group-hover:border-[#9e835c] group-hover:bg-[#9e835c] group-hover:text-[#eee8dc]" aria-hidden="true">→</span>
            </Link>
          </FadeUp>
          <span className="absolute bottom-8 right-8 hidden text-[9px] uppercase tracking-[0.3em] text-[#82796a] lg:block [writing-mode:vertical-rl]">Scorri per entrare</span>
        </div>
      </section>

      <section className="bg-[#20251f] px-6 py-28 text-[#eee8dc] sm:px-10 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-center gap-5 text-[#c5a46d] lg:mb-24">
            <span className="text-[9px] uppercase tracking-[0.32em]">Opera e parola</span>
            <span className="h-px flex-1 bg-current opacity-35" />
            <span className="font-serif text-sm italic opacity-70">I</span>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(26rem,0.68fr)] lg:gap-[9vw]">
            <FadeIn>
              <figure className="mx-auto w-full max-w-[42rem] lg:mx-0">
                <div className="relative aspect-[1244/829] overflow-hidden bg-[#151815] shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
                  {data.header?.operaInEvidenza?.immagine ? <Image
                    src={urlFor(data.header.operaInEvidenza.immagine).width(1244).height(829).fit('crop').url()}
                    alt={data.header.operaInEvidenza.immagine.alt || 'Thàvma, autoritratto di Denise Alesi'}
                    fill
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    className="object-cover transition-transform duration-1000 hover:scale-[1.015]"
                  /> : <div className="flex h-full items-center justify-center px-8 text-center font-serif text-lg italic text-white/35">Carica “Thàvma” nello spazio Opera in evidenza dello Studio</div>}
                </div>
                <figcaption className="mt-5 max-w-md text-[9px] leading-relaxed tracking-[0.12em] text-white/45">{data.header?.operaInEvidenza?.didascalia || '“Thàvma” (autoritratto), dal libro Rivelazioni di Denise Alesi'}</figcaption>
              </figure>
            </FadeIn>

            <FadeUp>
              <div className="mb-10">
                <p className="mb-5 text-[9px] uppercase tracking-[0.32em] text-[#c5a46d]">{data.header?.operaInEvidenza?.sottotitolo || 'Dialogo XIV'}</p>
                <h2 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl xl:text-7xl">{data.header?.operaInEvidenza?.titolo || 'Castelli di carta'}</h2>
              </div>
              <span className="mb-10 block h-px w-16 bg-[#c5a46d]/60" />
              <div className="max-w-lg whitespace-pre-line font-serif text-lg leading-[1.45] text-white/75 [&_p]:m-0 [&_p:last-child]:mt-8 [&_p:last-child]:text-sm [&_p:last-child]:text-white/45 [&_em]:italic">
                {data.header?.operaInEvidenza?.testo?.length ? <PortableText value={data.header.operaInEvidenza.testo} /> : <>
                  <p>Ho visto menzogne viaggiare<br/>nei decenni velati, di soffuse follie.<br/>Ho visto pupille dilatarsi<br/>incontrando la verità,<br/>uscire incredule<br/>da orbite defraudate.<br/>Ho udito cuori urlare<br/>a destini passati<br/>in cerca di giustizia.<br/>Ho visto una vita davanti a me<br/>e non l’ho riconosciuta</p>
                  <p>(Tratto da <em>Rivelazioni</em> di Denise Alesi)</p>
                </>}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="border-t border-black/15 bg-[#eee8dc] px-6 py-24 text-[#20231f] md:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-end justify-between border-b border-black/20 pb-6">
            <div><span className="text-[9px] uppercase tracking-[0.3em] text-black/40">01</span><h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] md:text-6xl">{text.works}</h2></div>
            <Link href={`/${lang}/opere`} className="hidden text-[10px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black sm:block">{text.allWorks} →</Link>
          </div>
          {data.opere.length ? <div className="grid gap-px bg-black/15 sm:grid-cols-2 xl:grid-cols-4">
            {data.opere.map((opera, index) => <FadeIn key={opera._id} delay={index * 0.12} className="bg-[#eee8dc]">
              <Link href={`/${lang}/opere/${opera._id}`} className="group block p-4 pb-7">
                <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-black/5">{opera.immagine && <Image src={urlFor(opera.immagine).width(750).height(938).fit('crop').url()} alt={opera.titolo || 'Opera'} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />}</div>
                <div className="flex items-baseline justify-between gap-4"><h3 className="font-serif text-xl leading-tight text-[#20231f]">{opera.titolo}</h3>{opera.anno && <span className="text-[9px] tracking-widest text-black/40">{opera.anno}</span>}</div>
              </Link>
            </FadeIn>)}
          </div> : <p className="font-serif text-2xl italic text-black/45">Le opere abiteranno presto questo spazio.</p>}
          <Link href={`/${lang}/opere`} className="mt-12 inline-block text-[10px] uppercase tracking-[0.24em] text-black/55 sm:hidden">{text.allWorks} →</Link>
        </div>
      </section>
      <ContactsView contattiData={contacts} lang={lang} />
    </div>
  )
}
