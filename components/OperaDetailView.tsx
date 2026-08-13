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
    it: '← Torna alla galleria',
    en: '← Back to gallery',
    es: '← Volver a la galería',
};

export default function OperaDetailView({ opera }: { opera: Opera }) {
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams();

    // Estraiamo lang e id (ID della galleria) dalle rotte dinamiche app/[lang]/gallerie/[id]/opere/[operaId]
    const lang = (params?.lang as string) || 'it';
    const galleriaId = params?.id as string;

    const backLabel = backLabels[lang] || backLabels.it;

    const imageUrl = opera.immagine ? urlFor(opera.immagine).url() : '';
    const audioUrl = opera.audio?.asset?.url;
    const audioTitolo = opera.audio?.titolo || "Ascolta il commento dell'opera";

    const slides = [
        {
            src: imageUrl,
            title: opera.titolo,
            description: opera.descrizione || "",
        }
    ];

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
            {/* Link di ritorno alla galleria */}
            {galleriaId && (
                <div className="pt-1 mb-4 md:mb-6">
                    <Link
                        href={`/${lang}/gallerie/${galleriaId}`}
                        className="inline-flex items-center text-xs uppercase tracking-widest text-[#9ca9af] hover:text-white transition-colors duration-200"
                    >
                        {backLabel}
                    </Link>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Immagine con click per aprire il Lightbox */}
                <div
                    className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg bg-[#272833] cursor-zoom-in group"
                    onClick={() => setIsOpen(true)}
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
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-serif mb-2">{opera.titolo}</h1>
                        {opera.descrizione && (
                            <p className="text-[#9ca9af] leading-relaxed whitespace-pre-line">
                                {opera.descrizione}
                            </p>
                        )}
                    </div>

                    {/* Player Audio */}
                    {audioUrl && (
                        <div className="p-4 rounded-xl bg-[#272833] border border-white/10 mt-2">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-3">
                                {audioTitolo}
                            </p>
                            <audio controls src={audioUrl} className="w-full">
                                Il tuo browser non supporta l&apos;elemento audio.
                            </audio>
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