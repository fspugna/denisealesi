import AboutView from '@/components/AboutView'
import { FadeIn, FadeUp } from '@/components/Animate'
import ContactsView from '@/components/ContactsView'
import HeroBackground from '@/components/HeroBackground'
import MainMenu from '@/components/MainMenu'
import ScrollToTop from '@/components/ScrollToTop'
import { getPrimaryImage, getYouTubeId } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Esposizione, Galleria, HomeData, labelsTranslations, Notizia, Recensione, Video } from '@/types'
import { stegaClean } from '@sanity/client/stega'
import Image from 'next/image'
import Link from 'next/link'

const dateLocales = {
  it: 'it-IT',
  en: 'en-US',
  es: 'es-ES',
} as const

const heroStyleClasses = {
  carattere: {sans: 'font-sans', serif: 'font-serif'},
  stile: {normale: 'not-italic', corsivo: 'italic'},
  peso: {leggero: 'font-light', normale: 'font-normal', grassetto: 'font-bold'},
  dimensione: {
    piccola: 'text-2xl md:text-3xl lg:text-4xl',
    media: 'text-3xl md:text-4xl lg:text-5xl',
    grande: 'text-4xl md:text-5xl lg:text-6xl',
  },
  colore: {bianco: 'text-white', tenue: 'text-white/75', blu: 'text-blue-400'},
} as const

function getHeroLineClasses(
  style: HomeData['header']['stilePrimaRiga'],
  defaults: {carattere: string; stile: string; peso: string; dimensione: string; colore: string},
) {
  return [
    heroStyleClasses.carattere[stegaClean(style?.carattere) as keyof typeof heroStyleClasses.carattere] || defaults.carattere,
    heroStyleClasses.stile[stegaClean(style?.stile) as keyof typeof heroStyleClasses.stile] || defaults.stile,
    heroStyleClasses.peso[stegaClean(style?.peso) as keyof typeof heroStyleClasses.peso] || defaults.peso,
    heroStyleClasses.dimensione[stegaClean(style?.dimensione) as keyof typeof heroStyleClasses.dimensione] || defaults.dimensione,
    heroStyleClasses.colore[stegaClean(style?.colore) as keyof typeof heroStyleClasses.colore] || defaults.colore,
  ].join(' ')
}

async function getHomeData(lang: string): Promise<HomeData> {
  return await client.fetch(`{
    "header": *[_id == "header"][0]{
      fotoHeader,
      "primaRiga": traduzioni[language == $lang][0].primaRiga,
      "secondaRiga": traduzioni[language == $lang][0].secondaRiga,
      stilePrimaRiga,
      stileSecondaRiga
    },
    "about": *[_id == "about"][0]{
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[language == "it"][0].titolo),
      "biografia": coalesce(traduzioni[language == $lang][0].biografia, traduzioni[language == "it"][0].biografia),
      foto,
      sfondo
    },
    "gallerie": *[_type == "galleria" && mostraInHomepage == true && count(opere) > 0] | order(ordine asc, _id asc)[0...4]{
      _id,    
      "nome": traduzioni[language == $lang][0].nome,
      "opere": opere[]->{
        _id,        
        "titolo": traduzioni[language == $lang][0].titolo,
        "descrizione": traduzioni[language == $lang][0].descrizione,
        immagine
      }
    },
    "totaleGallerie": count(*[_type == "galleria" && count(opere) > 0]),
    "video": *[_type == "video"] | order(data desc)[0] {
      _id,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo),
      data,
      url
    },
    "esposizioni": *[_type == "esposizione"] | order(data desc)[0..3]{
      _id,
      data,
      immagini,
      contenuto,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo, titolo)
    },
    "notizie": *[_type == "notizia"] | order(data desc)[0..3]{
      _id,
      data,
      immagini,
      contenuto,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo, titolo)
    },
    "recensioni": *[_type == "recensione"] | order(data desc)[0..3]{
      _id,
      data,
      immagini,
      contenuto,
      "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo, titolo)
    },
    "contatti": *[_type == "contatti"][0]{
      telefono,
      email,
      "fotoUrl": foto.asset->url,
      social
    }
  }`, {lang})
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const data = await getHomeData(lang);
  const t = labelsTranslations[lang as keyof typeof labelsTranslations] || labelsTranslations.it;
  const dateLocale = dateLocales[lang as keyof typeof dateLocales] || dateLocales.it;
  const primaRigaClasses = getHeroLineClasses(data.header?.stilePrimaRiga, {
    carattere: 'font-sans', stile: 'not-italic', peso: 'font-light',
    dimensione: 'text-4xl md:text-5xl lg:text-6xl', colore: 'text-white',
  });
  const secondaRigaClasses = getHeroLineClasses(data.header?.stileSecondaRiga, {
    carattere: 'font-serif', stile: 'italic', peso: 'font-light',
    dimensione: 'text-4xl md:text-5xl lg:text-6xl', colore: 'text-white',
  });

  const gallerieValide = data.gallerie || [];

  return (
    <main className="bg-[#1c1d26] text-white relative min-h-screen selection:bg-blue-500/30">

      <div className="relative z-10">
        <MainMenu lang={lang} />
        <ScrollToTop />

        {/* 1. HERO */}
        <section id="hero" className="relative h-screen flex items-center justify-center text-white overflow-hidden">
          <FadeIn duration={2.5}>
            <HeroBackground immagini={data.header?.fotoHeader || []} />
          </FadeIn>

          <div className="relative z-20 text-center px-6 w-full max-w-4xl mx-auto">
            {/* Aggiunto il delay per far comparire il testo dopo l'inizio dello sfondo */}
            <FadeUp delay={0.8}>
              <h1 className="tracking-tighter leading-tight">
                <span className={`block ${primaRigaClasses}`}>{data.header?.primaRiga || t.heroLine1}</span>
                <span className={`block ${secondaRigaClasses}`}>{data.header?.secondaRiga || t.heroLine2}</span>
              </h1>
            </FadeUp>
          </div>
        </section>

        {/* 2. CHI È - Rimossa la card rigida dal testo per farlo fluttuare sul vetro sfocato */}
        <AboutView aboutData={data.about} lang={lang} />        

        {/* 3. GALLERIA - Layout dinamico e bilanciato che evita buchi vuoti */}
        <section id="galleria" className="py-28 px-6">
          <FadeUp>
            <h2 className="text-center text-3xl font-serif mb-20 uppercase tracking-[0.2em] text-white/90">{t.galleries}</h2>
          </FadeUp>

          {/* Se c'è solo una o due gallerie, la griglia si adatta e si centra automaticamente */}
          <div className={`grid gap-12 max-w-5xl mx-auto ${gallerieValide.length === 1 ? 'grid-cols-1 max-w-2xl' : 'md:grid-cols-2'}`}>
            {gallerieValide.map((galleria: Galleria, index: number) => (
              <FadeUp key={galleria._id} delay={index * 0.15}>
                <Link
                  href={`/${lang}/gallerie/${galleria._id}`}
                  className="group cursor-pointer block"
                >
                  <h3 className="mb-4 text-xs uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-300">
                    {galleria.nome}
                  </h3>

                  <div className="relative aspect-[4/3] bg-[#272833] overflow-hidden rounded-md shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5 group-hover:border-white/10 transition-all duration-500">
                    <Image
                      src={urlFor(galleria.opere[0].immagine).url()}
                      alt={galleria.opere[0].titolo || t.artworkAlt}
                      fill
                      className="object-cover transition duration-1000 ease-out group-hover:scale-103"                      
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          {gallerieValide.length === 4 && data.totaleGallerie > 4 && (
            <FadeUp delay={0.3} className="mt-14 text-center">
              <Link
                href={`/${lang}/gallerie`}
                className="inline-block text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1"
              >
                {t.viewMoreGalleries} →
              </Link>
            </FadeUp>
          )}
        </section>

        {/* 4. VIDEO - Addolcito il blocco video per evitare rettangoli neri netti */}
        <section id="video" className="relative bg-gradient-to-b from-transparent via-[#272833]/40 to-transparent backdrop-blur-sm py-28 px-6 text-center border-y border-white/5">
          <FadeUp>
            <h2 className="text-3xl font-serif uppercase tracking-[0.2em] text-white/90 mb-12">{t.videos}</h2>
          </FadeUp>

          <div className="max-w-4xl mx-auto">
            {data.video && (() => {
              const videoItem: Video = data.video;
              return (
                <div className="px-6">
                  <div className="max-w-3xl mx-auto">
                    <FadeIn delay={0.2}>
                      {/* L'ombra profonda e l'overlay integrano l'iframe nativo senza stacchi sgradevoli */}
                      <div className="relative aspect-video w-full bg-black/60 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-white/10">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${getYouTubeId(videoItem.url)}`}
                          title={videoItem.titolo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </FadeIn>

                    <FadeUp delay={0.3} className="mt-10 text-center">
                      <h3 className="text-xl font-serif text-white/90 mb-4 tracking-wide">{videoItem.titolo}</h3>
                      <Link href={`/${lang}/video`} className="inline-block text-xs uppercase tracking-widest text-blue-400 border-b border-blue-400/20 pb-1 hover:text-blue-300 hover:border-blue-300 transition-all">
                        {t.viewAllVideos} →
                      </Link>
                    </FadeUp>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* 5. ESPOSIZIONI E NOTIZIE - Aggiunte micro-animazioni di accento */}
        <section className="py-28 px-6 grid md:grid-cols-2 gap-20 max-w-7xl mx-auto">
          {/* ESPOSIZIONI */}
          <div id="esposizioni">
            <FadeUp>
              <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-10 border-b border-white/10 pb-4 font-mono">{t.exhibitions}</h2>
            </FadeUp>
            <div className="grid gap-6">
              {data.esposizioni.map((e: Esposizione, index: number) => (
                <FadeUp key={e._id} delay={index * 0.1}>
                  <article>
                    <Link href={`/${lang}/esposizioni/${e._id}`} className="group flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 hover:border-blue-500/20 hover:bg-black/30 transition-all duration-300 shadow-xl">
                      {(() => {
                        const image = getPrimaryImage(e.immagini, e.contenuto)
                        return image ? (
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
                            <Image
                              src={urlFor(image).url()}
                              alt={e.titolo || t.imageFallbackAlt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : null
                      })()}
                      <div className="min-w-0 flex-1">
                        <time className="text-[10px] text-white/40 uppercase tracking-widest block mb-3 font-mono">
                          {new Date(e.data).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </time>
                        <h4 className="text-lg font-light text-white/80 group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                          {e.titolo}
                        </h4>
                      </div>
                    </Link>
                  </article>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.3}>
              <Link href={`/${lang}/esposizioni`} className="mt-12 inline-block text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1">
                {t.viewAllExhibitions} →
              </Link>
            </FadeUp>
          </div>

          {/* NOTIZIE */}
          <div id="notizie">
            <FadeUp>
              <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-10 border-b border-white/10 pb-4 font-mono">{t.latestNews}</h2>
            </FadeUp>
            <div className="grid gap-6">
              {data.notizie.map((n: Notizia, index: number) => (
                <FadeUp key={n._id} delay={index * 0.1}>
                  <article>
                    <Link href={`/${lang}/notizie/${n._id}`} className="group flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 hover:border-blue-500/20 hover:bg-black/30 transition-all duration-300 shadow-xl">
                      {(() => {
                        const image = getPrimaryImage(n.immagini, n.contenuto)
                        return image ? (
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
                            <Image
                              src={urlFor(image).url()}
                              alt={n.titolo || t.imageFallbackAlt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : null
                      })()}
                      <div className="min-w-0 flex-1">
                        <time className="text-[10px] text-white/40 uppercase tracking-widest block mb-3 font-mono">
                          {new Date(n.data).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </time>
                        <h4 className="text-lg font-light text-white/80 group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                          {n.titolo}
                        </h4>
                      </div>
                    </Link>
                  </article>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.3}>
              <Link href={`/${lang}/notizie`} className="mt-12 inline-block text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1">
                {t.viewAllNews} →
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* 6. RECENSIONI - Layout a doppia colonna per valorizzare lunghezze differenti */}
        <section id="recensioni" className="bg-[#272833]/60 backdrop-blur-md py-28 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-16 border-b border-white/10 pb-4 font-mono max-w-4xl mx-auto">
                {t.reviews}
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-8 items-start text-left mb-12">
              {data.recensioni.map((r: Recensione, index: number) => (
                <FadeUp key={r._id} delay={index * 0.15}>
                  <Link
                    href={`/${lang}/recensioni/${r._id}`}
                    className="group flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 hover:border-blue-500/20 hover:bg-black/30 transition-all duration-300 shadow-xl min-h-[140px]"
                  >
                    {(() => {
                      const image = getPrimaryImage(r.immagini, r.contenuto)
                      return image ? (
                        <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
                          <Image
                            src={urlFor(image).url()}
                            alt={r.titolo || t.imageFallbackAlt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : null
                    })()}
                    <div className="min-w-0 flex flex-col justify-between grow self-stretch">
                      {r.data ? (
                        <time className="text-[10px] text-white/40 uppercase tracking-widest block mb-3 font-mono">
                          {new Date(r.data).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </time>
                      ) : null}
                      <blockquote className="text-lg font-serif italic text-white/80 group-hover:text-blue-400 transition-colors leading-relaxed">
                        “{r.titolo}”
                      </blockquote>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-6 block group-hover:text-white/60 transition-colors">
                        {t.readFullReview} →
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.4}>
              <Link
                href={`/${lang}/recensioni`}
                className="inline-block text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1"
              >
                {t.viewAllReviews} →
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* 7. CONTATTI - Bottoni social alleggeriti (Sottili e Minimali) */}
        <ContactsView contattiData={data.contatti} lang={lang} />
      </div>
    </main>
  )
}
