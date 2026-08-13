'use client';
import { urlFor } from '@/sanity/lib/image';
import { getPrimaryImage } from '@/lib/utils';
import { Notizia, SanityImage } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from './Header';
// 👇 1. IMPORTA MOTION
import { motion } from 'framer-motion';

// Varianti per coordinare l'effetto cascata sulla griglia
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Ritardo cumulativo tra una card e l'altra
        },
    },
};

// Varianti per l'animazione di ogni singola card
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.21, 0.47, 0.32, 0.98] as const // 👈 AGGIUNGI QUESTO
        }
    },
};

export default function NotizieList({ notizie, currentPage, totalPages, lang }: { notizie: Notizia[], currentPage: number, totalPages: number, lang: string }) {    

    return (
        <main className="bg-[#1c1d26] min-h-screen">            
            <Header />

            <section className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Il titolo sale leggermente all'avvio */}
                <motion.h1 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif mb-16 text-white"
                >
                    Notizie
                </motion.h1>

                {/* 2. GRIGLIA TRASFORMATA IN MOTION.DIV */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={currentPage} // 👈 Forza il reset dell'animazione al cambio pagina della paginazione
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {notizie.map((n) => {
                        const coverImage = getPrimaryImage(n.immagini, n.contenuto);
                        return (
                            // Avvolgiamo ogni link con un motion.div che eredita gli stati "hidden" e "show" dal padre
                            <motion.div key={n._id} variants={itemVariants} className="h-full">
                                <Link 
                                    href={`/${lang}/notizie/${n._id}`} 
                                    className="group flex flex-col h-full bg-[#272833] rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                                >
                                    <div className="relative h-60 w-full overflow-hidden bg-gray-800">
                                        {coverImage ? (
                                            <Image
                                                src={urlFor(coverImage).url()}
                                                alt={n.titolo || "Immagine notizia"}
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
                                            {new Date(n.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                        <h2 className="text-white text-xl font-serif leading-snug mb-6 group-hover:text-blue-400 transition-colors">
                                            {n.titolo}
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

                {/* Paginazione animata in dissolvenza */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-16 flex justify-center items-center gap-6"
                >
                    <div className="w-36 text-right">
                        {currentPage > 1 && (
                            <Link
                                href={`/${lang}/notizie?page=${currentPage - 1}`}
                                className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                            >
                                ← Precedenti
                            </Link>
                        )}
                    </div>

                    <span className="text-white/50 text-sm min-w-[100px] text-center">Pagina {currentPage} di {totalPages}</span>

                    <div className="w-36 text-left">
                        {currentPage < totalPages && (
                            <Link
                                href={`/${lang}/notizie?page=${currentPage + 1}`}
                                className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                            >
                                Successivi →
                            </Link>
                        )}
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
