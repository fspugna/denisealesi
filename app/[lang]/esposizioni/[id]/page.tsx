import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import PostGallery from '@/components/PostGallery';
import { getLocalizedBody, getLocalizedTitle } from '@/lib/localizedContent';
import { dateLocales, getDisplayImages, getPrimaryImage } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { Esposizione, LocalizedContentTranslation, PortableContentBlock } from '@/types';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
// 👇 1. IMPORTA IL COMPONENTE ANIMATO
import { FadeUp } from '@/components/Animate';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

type EsposizioneDocument = Omit<Esposizione, 'titolo' | 'contenuto'> & {
    titolo?: string | null;
    contenuto?: PortableContentBlock[] | null;
    immagini?: Esposizione['immagini'];
    traduzioni?: LocalizedContentTranslation[] | null;
};

async function getEsposizioneCompleta(id: string) {
    const query = `{
    "esposizione": *[_type == "esposizione" && _id == $id][0]{
      _id,
      titolo,
      data,
      contenuto,
      immagini,
      traduzioni[]{
        language,
        titolo,
        contenuto
      }
    },
    "altreEsposizioni": *[_type == "esposizione" && _id != $id] | order(data desc)[0..2]{
      _id,
      titolo,
      data,
      contenuto,
      immagini,
      traduzioni[]{
        language,
        titolo,
        contenuto
      }
    }
}`;
    return await client.fetch(query, { id });
}

const components: PortableTextComponents = {
    types: {
        image: () => null,
    },
};

const galleryTitles = {
    it: 'Galleria immagini',
    en: 'Image gallery',
    es: 'Galeria de imagenes',
} as const;

export default async function EsposizionePage({ params }: { params: Promise<{ id: string; lang: string }> }) {
    const { id, lang } = await params;
    const { esposizione: esposizioneDocument, altreEsposizioni: altreEsposizioniDocuments } = await getEsposizioneCompleta(id);
    const dateLocale = dateLocales[lang as keyof typeof dateLocales] || dateLocales.it;

    if (!esposizioneDocument) return <div>Esposizione non trovata</div>;

    const esposizione: Esposizione = {
        ...esposizioneDocument,
        titolo: getLocalizedTitle(esposizioneDocument.traduzioni, lang, esposizioneDocument.titolo),
        contenuto: getLocalizedBody(esposizioneDocument.traduzioni, lang, esposizioneDocument.contenuto)
    };
    const altreEsposizioni: Esposizione[] = (altreEsposizioniDocuments as EsposizioneDocument[]).map((item) => ({
        ...item,
        titolo: getLocalizedTitle(item.traduzioni, lang, item.titolo),
        contenuto: getLocalizedBody(item.traduzioni, lang, item.contenuto)
    }));
    const images = getDisplayImages(esposizione.immagini, esposizione.contenuto);
    const galleryTitle = galleryTitles[lang as keyof typeof galleryTitles] || galleryTitles.it;

    return (
        <main className="bg-[#1c1d26] text-white min-h-screen">
            <Header />

            {/* 2. Contenuto Principale Animato */}
            <article className={`mx-auto py-24 px-6 ${images.length > 0 ? 'max-w-7xl' : 'max-w-3xl'}`}>
                <div className={`${images.length > 0 ? 'grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start' : ''}`}>
                    <div>
                        <FadeUp>
                            <h1 className="text-4xl md:text-5xl font-serif mb-6">{esposizione.titolo}</h1>
                        </FadeUp>

                        <FadeUp delay={0.15}>
                            <time className="text-sm opacity-50 mb-12 block uppercase tracking-widest">
                                {new Date(esposizione.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                        </FadeUp>

                        <FadeUp delay={0.3}>
                            <div className="prose prose-invert prose-lg max-w-none">
                                <PortableText value={esposizione.contenuto} components={components} />
                            </div>
                        </FadeUp>
                    </div>

                    {images.length > 0 && (
                        <FadeUp delay={0.4} className="mt-16 border-t border-white/10 pt-12 lg:mt-0 lg:border-t-0 lg:border-l lg:border-white/10 lg:pt-0 lg:pl-10 lg:sticky lg:top-28">
                            <PostGallery images={images} title={galleryTitle} />
                        </FadeUp>
                    )}
                </div>
            </article>

            {/* 3. Sezione Suggerimenti Animata (InView quando l'utente scende con lo scroll) */}
            {altreEsposizioni.length > 0 && (
                <section className="bg-[#272833] py-20 px-6 mt-12 overflow-hidden">
                    <div className="max-w-6xl mx-auto">

                        <FadeUp>
                            <div className="flex justify-between items-end mb-10">
                                <h3 className="text-sm uppercase tracking-[0.2em] opacity-50">Altre Esposizioni</h3>
                                <Link
                                    href={`/${lang}/esposizioni`}
                                    className="text-xs uppercase tracking-widest text-blue-400 hover:text-white transition-colors border-b border-blue-400/30 pb-1"
                                >
                                    Vedi tutte le esposizioni →
                                </Link>
                            </div>
                        </FadeUp>

                        <div className="grid md:grid-cols-2 gap-8">
                            {altreEsposizioni.map((e: Esposizione, index: number) => (
                                // Effetto stagger basato sull'indice per far apparire le esposizioni correlate una dopo l'altra
                                <FadeUp key={e._id} delay={index * 0.15}>
                                    <Link 
                                        href={`/${lang}/esposizioni/${e._id}`} 
                                        className="group flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 hover:border-blue-500/20 hover:bg-black/30 transition-all duration-300 shadow-xl"
                                    >
                                        {(() => {
                                            const image = getPrimaryImage(e.immagini, e.contenuto)
                                            return image ? (
                                                <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
                                                    <Image
                                                        src={urlFor(image).url()}
                                                        alt={e.titolo}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"                                                        
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
                                </FadeUp>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
