'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import { Opera } from '@/types';

// Mappa dinamica per l'etichetta del pulsante di ritorno in base alla lingua
const backLabels: Record<string, string> = {
    it: '← Torna alle opere',
    en: '← Back to works',
    es: '← Volver a las obras',
};

const relatedLabels = {
    it: {title: 'Approfondisci', gallery: 'Apri la galleria fotografica', video: 'Guarda il video', amazon: 'Compra su Amazon'},
    en: {title: 'Explore', gallery: 'Open the photo gallery', video: 'Watch the video', amazon: 'Buy on Amazon'},
    es: {title: 'Descubre más', gallery: 'Abrir la galería fotográfica', video: 'Ver el vídeo', amazon: 'Comprar en Amazon'},
} as const;

export default function OperaDetailView({ opera }: { opera: Opera }) {
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams();

    const lang = (params?.lang as string) || 'it';

    const backLabel = backLabels[lang] || backLabels.it;
    const related = relatedLabels[lang as keyof typeof relatedLabels] || relatedLabels.it;

    // La versione nel riquadro viene ritagliata dal CDN di Sanity, così crop e
    // hotspot scelti nello Studio determinano l'inquadratura del formato 3:4.
    const imageUrl = opera.immagine
        ? urlFor(opera.immagine).width(1200).height(1600).fit('crop').url()
        : '';
    // Nel lightbox conserviamo invece il file completo, senza ritaglio.
    const fullImageUrl = opera.immagine ? urlFor(opera.immagine).url() : '';
    const audioUrl = opera.audio?.asset?.url;
    const audioTitolo = opera.audio?.titolo || "Ascolta il commento dell'opera";

    const slides = fullImageUrl ? [
        {
            src: fullImageUrl,
            title: opera.titolo,
            description: opera.descrizione || "",
        }
    ] : [];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="flex flex-col">
                <div className="pt-1 mb-8 md:mb-10">
                    <Link
                        href={`/${lang}/opere`}
                        className="inline-flex items-center text-[10px] uppercase tracking-[0.24em] text-black/45 hover:text-black transition-colors duration-200"
                    >
                        {backLabel}
                    </Link>
                </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Immagine con click per aprire il Lightbox */}
                <div
                    className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-[#d8d0c2] cursor-zoom-in group"
                    onClick={() => imageUrl && setIsOpen(true)}
                >
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={opera.titolo || "Opera"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-102"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity"><span aria-label="Ingrandisci">🔍</span></div>
                    </div>
                </div>

                {/* Dettagli e Audio Player */}
                <div className="flex flex-col gap-6 md:pt-10">
                    <div>
                        {opera.anno && <p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-black/45">{opera.anno}</p>}
                        <h1 className="mb-6 font-serif text-4xl leading-tight md:text-6xl">{opera.titolo}</h1>
                        {opera.descrizione && (
                            <p className="max-w-xl font-serif text-lg leading-relaxed text-[#625d53] whitespace-pre-line">
                                {opera.descrizione}
                            </p>
                        )}
                    </div>

                    {/* Player Audio */}
                    {audioUrl && (
                        <div className="mt-6 border-t border-black/15 py-6">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-3">
                                {audioTitolo}
                            </p>
                            <audio controls src={audioUrl} className="w-full">
                                Il tuo browser non supporta l&apos;elemento audio.
                            </audio>
                        </div>
                    )}

                    {opera.amazonUrl && (
                        <a
                            href={opera.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="mt-3 inline-flex w-fit items-center gap-4 bg-[#20251f] px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-[#eee8dc] transition-colors hover:bg-[#343b32]"
                        >
                            <span>{related.amazon}</span>
                            <span aria-hidden="true">↗</span>
                        </a>
                    )}

                    {(opera.galleriaCollegata || opera.videoCollegato) && (
                        <div className="mt-6 border-t border-black/15 pt-7">
                            <p className="mb-4 text-[9px] uppercase tracking-[0.28em] text-black/45">{related.title}</p>
                            <div className="flex flex-col gap-3">
                                {opera.galleriaCollegata && <Link href={`/${lang}/gallerie/${opera.galleriaCollegata._id}`} className="group flex items-center justify-between border-b border-black/15 py-3 font-serif text-lg">
                                    <span>{related.gallery}: <em>{opera.galleriaCollegata.titolo}</em></span><span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>}
                                {opera.videoCollegato && <Link href={`/${lang}/video/${opera.videoCollegato._id}`} className="group flex items-center justify-between border-b border-black/15 py-3 font-serif text-lg">
                                    <span>{related.video}: <em>{opera.videoCollegato.titolo}</em></span><span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox per ingrandimento a tutto schermo */}
            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={slides}
                carousel={{ finite: true }}
                plugins={[Captions, Zoom]}
                captions={{
                    showToggle: true,
                    descriptionTextAlign: 'center'
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    scrollToZoom: true
                }}
                styles={{ container: { backgroundColor: "rgba(28, 29, 38, 0.95)" } }}
            />
        </div>
    );
}
