'use client';
import { useState, useEffect } from 'react';
import { urlFor } from '@/sanity/lib/image';
import { SanityImage } from '@/types';

export default function HeroBackground({ immagini }: { immagini: SanityImage[] }) {
    const [bgUrl, setBgUrl] = useState<string>('');

    useEffect(() => {
        if (immagini && immagini.length > 0) {
            const randomIndex = Math.floor(Math.random() * immagini.length);
            const url = urlFor(immagini[randomIndex]).url();

            // Usiamo requestAnimationFrame o un micro-timeout per spostare 
            // il setState fuori dal ciclo sincrono di esecuzione dell'effetto
            requestAnimationFrame(() => {
                setBgUrl(url);
            });
        }
    }, [immagini]);

    // Finché non siamo sul client e l'url non è impostato, mostra uno sfondo scuro coerente
    if (!bgUrl) {
        return <div className="absolute inset-0 bg-[#1c1d26]" />;
    }

    return (
        <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{ backgroundImage: `url(${bgUrl})` }}
        >
            <div className="absolute inset-0 bg-black/45" />
        </div>
    );
}