'use client';
import { getPrimaryImage } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { Esposizione } from '@/types';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from './Header';

// Varianti per l'effetto cascata sulla griglia
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Ritardo incrementale tra l'apparizione delle card
        },
    },
};

// Varianti per lo scorrimento morbido verso l'alto delle singole card
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.21, 0.47, 0.32, 0.98] // Curva fluida premium
        }
    },
};

interface EsposizioniListProps {
    initialEsposizioni: Esposizione[];
    currentPage: number;
    totalPages: number;
    lang: string;
}

export default function EsposizioniList({ initialEsposizioni, currentPage, totalPages, lang }: EsposizioniListProps) {

    return (
        <main className="bg-[#1c1d26] min-h-screen">            
            <Header />
            <section className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Titolo animato in dissolvenza all'ingresso */}
                <motion.h1 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif mb-16 text-white"
                >
                    Esposizioni
                </motion.h1>

                {/* GRIGLIA ANIMATA AD EFFETTO CASCATA (STAGGER) */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={currentPage} // 👈 Resetta l'effetto cascata quando l'utente volta pagina
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {initialEsposizioni.map((e) => {
                        const coverImage = getPrimaryImage(e.immagini, e.contenuto);
                        return (
                            <motion.div key={e._id} variants={itemVariants} className="h-full">
                                <Link 
                                    href={`/${lang}/esposizioni/${e._id}`} 
                                    className="group flex flex-col h-full bg-[#272833] rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                                >
                                    <div className="relative h-60 w-full overflow-hidden bg-gray-800">
                                        {coverImage ? (
                                            <Image
                                                src={urlFor(coverImage).url()}
                                                alt={e.titolo || "Immagine esposizione"}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"                                                
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <span>Nessuna immagine</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <time className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-4 block">
                                            {new Date(e.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                        <h2 className="text-white text-xl font-serif leading-snug mb-6 group-hover:text-blue-400 transition-colors">
                                            {e.titolo}
                                        </h2>
                                        <span className="mt-auto text-xs uppercase tracking-widest text-white/60 border-b border-white/20 pb-1 self-start group-hover:text-white group-hover:border-white transition-colors">
                                            Scopri di più
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* SEZIONE PAGINAZIONE ANIMATA (Mostrata solo se c'è più di una pagina) */}
                {totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-16 flex justify-center items-center gap-6"
                    >
                        {/* Box fisso a sinistra per evitare che il testo centrale salti o si sposti */}
                        <div className="w-36 text-right">
                            {currentPage > 1 && (
                                <Link 
                                    href={`/${lang}/esposizioni?page=${currentPage - 1}`} 
                                    className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                                >
                                    ← Precedenti
                                </Link>
                            )}
                        </div>
                        
                        <span className="text-white/50 text-sm min-w-[100px] text-center">
                            Pagina {currentPage} di {totalPages}
                        </span>

                        {/* Box fisso a destra per bilanciare geometricamente l'allineamento */}
                        <div className="w-36 text-left">
                            {currentPage < totalPages && (
                                <Link 
                                    href={`/${lang}/esposizioni?page=${currentPage + 1}`} 
                                    className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                                >
                                    Successivi →
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    );
}
