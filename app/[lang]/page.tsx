import {FadeIn, FadeUp} from '@/components/Animate'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import type {About, Header, Notizia, Opera} from '@/types'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

type HomePageData = {
  header: Header | null
  about: About | null
  opere: Opera[]
  notizie: Notizia[]
}

const copy = {
  it: {role: 'Autrice · artista visiva', works: 'Opere scelte', allWorks: 'Tutte le opere', thoughts: 'Pensieri recenti', allThoughts: 'Archivio dei pensieri', about: 'Una voce, una ricerca', read: 'Leggi'},
  en: {role: 'Author · visual artist', works: 'Selected works', allWorks: 'All works', thoughts: 'Recent thoughts', allThoughts: 'Thoughts archive', about: 'A voice, a search', read: 'Read'},
  es: {role: 'Autora · artista visual', works: 'Obras escogidas', allWorks: 'Todas las obras', thoughts: 'Pensamientos recientes', allThoughts: 'Archivo de pensamientos', about: 'Una voz, una búsqueda', read: 'Leer'},
} as const

async function getHomeData(lang: string): Promise<HomePageData> {
  return client.fetch(`{
    "header": *[_id == "header"][0]{
      ritratto,
      "citazione": coalesce(traduzioni[language == $lang][0].citazione, traduzioni[language == "it"][0].citazione)
    },
    "about": *[_id == "about"][0]{
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo),
      "biografia": coalesce(traduzioni[language == $lang][0].biografia, traduzioni[language == "it"][0].biografia),
      foto
    },
    "opere": *[_type == "opera" && mostraInHomepage == true] | order(ordine asc, _id asc)[0...3]{
      _id, immagine, anno, ordine,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo),
      "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[language == "it"][0].descrizione, traduzioni[0].descrizione)
    },
    "notizie": *[_type == "notizia"] | order(data desc)[0...3]{
      _id, data,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo, traduzioni[0].titolo, titolo)
    }
  }`, {lang})
}

export default async function Home({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const data = await getHomeData(lang)
  const text = copy[lang as keyof typeof copy] || copy.it
  const portrait = data.header?.ritratto

  return (
    <div className="overflow-hidden bg-[#eee8dc] text-[#20231f]">
      <section className="grid min-h-screen lg:grid-cols-2">
        <div className="relative min-h-[58vh] overflow-hidden bg-[#343a34] lg:min-h-screen">
          {portrait ? <Image src={urlFor(portrait).width(1400).height(1800).fit('crop').url()} alt={portrait.alt || 'Ritratto di Denise Alesi'} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center grayscale-[20%]" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <p className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[0.35em] text-white/65 md:left-10">Denise Alesi · Roma</p>
        </div>

        <div className="relative flex min-h-[72vh] flex-col justify-center px-7 py-28 sm:px-12 lg:min-h-screen lg:px-[10vw]">
          <span className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#766e60]">{text.role}</span>
          <FadeUp>
            <h1 className="font-serif text-[clamp(3.5rem,7vw,7.8rem)] leading-[0.82] tracking-[-0.05em]">Denise<br/><em className="font-normal">Alesi</em></h1>
          </FadeUp>
          <div className="my-8 h-px w-16 bg-[#9e835c]" />
          <FadeUp delay={0.15}>
            <div className="max-w-2xl font-serif text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.65] text-[#4e4b43] [&_p+p]:mt-5 [&_p:last-child]:text-sm [&_p:last-child]:text-[#766e60]">
              {data.header?.citazione?.length ? <PortableText value={data.header.citazione} /> : <>
                <p>Non può esistere spazio tra ciò che fu, che è, e che sarà. Ogni accadimento assume le sembianze di ciò che crediamo, di ciò del quale abbiamo bisogno fosse anche dell’inferno. Solo quando la verità ha luogo è possibile scostare il velo che avvolge ogni pensiero, ogni immagine, allora tutto si trasforma, tutto accade. Il racconto crea la storia, nutre l&apos;immaginazione, contribuisce alla conoscenza di se stessi e delle cose. Si racconta con la parola, si racconta con le ombre, si racconta con la luce.</p>
                <p>(tratto da <em>Immagini e parole</em> di Denise Alesi)</p>
              </>}
            </div>
          </FadeUp>
          <span className="absolute bottom-8 right-8 hidden text-[9px] uppercase tracking-[0.3em] text-[#82796a] lg:block [writing-mode:vertical-rl]">Scorri per entrare</span>
        </div>
      </section>

      {data.about && <section className="grid border-t border-[#292c27]/15 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-[#292c27]/15 px-7 py-12 lg:border-b-0 lg:border-r lg:px-12 lg:py-24">
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#766e60]">01 — {text.about}</span>
        </div>
        <FadeUp className="px-7 py-16 sm:px-12 lg:px-[9vw] lg:py-24">
          <h2 className="mb-10 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">{data.about.titolo}</h2>
          <div className="prose prose-lg max-w-2xl font-serif leading-relaxed text-[#4e4b43] prose-p:mb-5">
            <PortableText value={data.about.biografia || []} />
          </div>
          <Link href={`/${lang}/about`} className="mt-10 inline-block border-b border-[#20231f] pb-1 text-[10px] uppercase tracking-[0.25em]">{text.read}</Link>
        </FadeUp>
      </section>}

      <section className="bg-[#20251f] px-6 py-24 text-[#eee8dc] md:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-end justify-between border-b border-white/15 pb-6">
            <div><span className="text-[9px] uppercase tracking-[0.3em] text-white/45">02</span><h2 className="mt-3 font-serif text-4xl md:text-6xl">{text.works}</h2></div>
            <Link href={`/${lang}/opere`} className="hidden text-[10px] uppercase tracking-[0.24em] text-white/60 hover:text-white sm:block">{text.allWorks} →</Link>
          </div>
          {data.opere.length ? <div className="grid gap-px bg-white/15 lg:grid-cols-3">
            {data.opere.map((opera, index) => <FadeIn key={opera._id} delay={index * 0.12} className="bg-[#20251f]">
              <Link href={`/${lang}/opere/${opera._id}`} className="group block p-4 pb-8">
                <div className="relative mb-7 aspect-[4/5] overflow-hidden bg-white/5">{opera.immagine && <Image src={urlFor(opera.immagine).width(900).height(1125).fit('crop').url()} alt={opera.titolo || 'Opera'} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0" />}</div>
                <div className="flex items-baseline justify-between gap-4"><h3 className="font-serif text-2xl">{opera.titolo}</h3>{opera.anno && <span className="text-[9px] tracking-widest text-white/40">{opera.anno}</span>}</div>
              </Link>
            </FadeIn>)}
          </div> : <p className="font-serif text-2xl italic text-white/45">Le opere abiteranno presto questo spazio.</p>}
          <Link href={`/${lang}/opere`} className="mt-12 inline-block text-[10px] uppercase tracking-[0.24em] text-white/60 sm:hidden">{text.allWorks} →</Link>
        </div>
      </section>

      <section className="px-7 py-24 sm:px-12 lg:px-[10vw] lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between"><div><span className="text-[9px] uppercase tracking-[0.3em] text-[#766e60]">03</span><h2 className="mt-3 font-serif text-4xl md:text-6xl">{text.thoughts}</h2></div></div>
          <div className="border-t border-[#292c27]/20">
            {data.notizie.map((notizia, index) => <Link key={notizia._id} href={`/${lang}/notizie/${notizia._id}`} className="group grid gap-3 border-b border-[#292c27]/20 py-7 md:grid-cols-[4rem_1fr_auto] md:items-baseline">
              <span className="text-[10px] text-[#766e60]">{String(index + 1).padStart(2, '0')}</span><h3 className="font-serif text-2xl transition-transform group-hover:translate-x-2 md:text-3xl">{notizia.titolo}</h3><time className="text-[9px] uppercase tracking-widest text-[#766e60]">{notizia.data ? new Date(notizia.data).getFullYear() : ''}</time>
            </Link>)}
          </div>
          <Link href={`/${lang}/notizie`} className="mt-10 inline-block border-b border-[#20231f] pb-1 text-[10px] uppercase tracking-[0.25em]">{text.allThoughts}</Link>
        </div>
      </section>
    </div>
  )
}
