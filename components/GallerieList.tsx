'use client';
import { Header } from '@/components/Header';
import { urlFor } from '@/sanity/lib/image';
import { Galleria } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from './Footer';
// 👇 IMPORTA MOTION E LE VARIANTI DEI TIPI
import { motion, Variants } from 'framer-motion';

// Varianti per l'effetto di apparizione a cascata (stagger) sulla griglia padre
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Ritardo cumulativo tra una card e l'altra
        },
    },
};

// Varianti per lo scorrimento morbido e dissolvenza verso l'alto di ogni singola card
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.21, 0.47, 0.32, 0.98] // Curva premium fluida ed elegante
        }
    },
};

interface GallerieListProps {
    initialGallerie: Galleria[];
    currentPage: number;
    totalPages: number;
    lang: string;
}

export default function GallerieList({ initialGallerie, currentPage, totalPages, lang }: GallerieListProps) {
    // Rimosso lo useState locale per permettere l'aggiornamento dei dati guidato dall'URL

    return (
        <main className="bg-[#1c1d26] min-h-screen">
            <Header />
            <section className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Titolo animato in ingresso */}
                <motion.h1 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif mb-16 text-white"
                >
                    Gallerie
                </motion.h1>

                {/* GRIGLIA TRASFORMATA IN MOTION.DIV PER GESTIRE LO STAGGER */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={currentPage} // 👈 Sgancia e riesegue l'animazione di ingresso quando si cambia pagina
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {initialGallerie.map((g) => {
                        return (
                            <motion.div key={g._id} variants={itemVariants} className="h-full">
                                <Link
                                    href={`/${lang}/gallerie/${g._id}`}
                                    className="group flex flex-col h-full bg-[#272833] rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                                >
                                    <div className="h-60 w-full overflow-hidden bg-gray-800">
                                        {g.copertina ? (
                                            <Image
                                                src={urlFor(g.copertina).url()}
                                                alt={g.nome}
                                                width={400}
                                                height={240}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20 text-white">
                                                <span>Nessuna opera</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <h2 className="text-xl font-serif leading-snug text-white group-hover:text-blue-400 transition-colors">
                                            {g.nome}
                                        </h2>
                                        <p className="mt-2 text-xs uppercase tracking-widest text-white/60">
                                            {g.opere?.length || 0} Opere
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* BLOCCO CONTROLLI PAGINAZIONE ANIMATI (Visibili solo se c'è più di una pagina) */}
                {totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-16 flex justify-center items-center gap-6"
                    >
                        {/* Spazio fisso a sinistra per preservare la centratura del contatore */}
                        <div className="w-36 text-right">
                            {currentPage > 1 && (
                                <Link 
                                    href={`/${lang}/gallerie?page=${currentPage - 1}`} 
                                    className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                                >
                                    ← Precedenti
                                </Link>
                            )}
                        </div>
                        
                        <span className="text-white/50 text-sm min-w-[100px] text-center">
                            Pagina {currentPage} di {totalPages}
                        </span>

                        {/* Spazio fisso a destra per bilanciare l'allineamento geometrico */}
                        <div className="w-36 text-left">
                            {currentPage < totalPages && (
                                <Link 
                                    href={`/${lang}/gallerie?page=${currentPage + 1}`} 
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
