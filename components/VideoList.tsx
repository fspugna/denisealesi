'use client';
import { Video } from '@/types';
import Link from 'next/link';
import { Header } from './Header';
import Image from 'next/image';
import { Footer } from './Footer';
import { getYouTubeThumbnail } from '@/lib/video';
// 👇 IMPORTA MOTION E LE VARIANTI DEI TIPI
import { motion, Variants } from 'framer-motion';

// Varianti per l'effetto di apparizione a cascata (stagger) sulla griglia padre
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Ritardo incrementale tra i video
        },
    },
};

// Varianti per l'animazione fluida di ingresso verso l'alto per ciascuna card
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

interface VideoListProps {
    initialVideos: Video[];
    currentPage: number;
    totalPages: number;
    lang: string;
}

export default function VideoList({ initialVideos, currentPage, totalPages, lang }: VideoListProps) {
    return (
        <main className="bg-[#1c1d26] min-h-screen">
            <Header />
            <section className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Titolo principale animato all'ingresso */}
                <motion.h1 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif mb-16 text-white"
                >
                    Video
                </motion.h1>

                {/* GRIGLIA PREPOSTA ALL'EFFETTO STAGGER */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={currentPage} // 👈 Forza il reset dell'animazione a cascata quando si volta pagina
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {initialVideos.map((v) => {
                        const thumbnail = getYouTubeThumbnail(v.url);
                        return (
                            <motion.div key={v._id} variants={itemVariants} className="h-full">
                                <Link 
                                    href={`/${lang}/video/${v._id}`} 
                                    className="group flex flex-col h-full bg-[#272833] rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-gray-800">
                                        {thumbnail ? (
                                            <Image
                                                src={thumbnail}
                                                alt={v.titolo}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                                <span className="text-xs text-gray-500">Video</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <time className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-3 block">
                                            {v.data ? new Date(v.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Video'}
                                        </time>
                                        <h2 className="text-white text-xl font-serif leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {v.titolo}
                                        </h2>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CONTROLLI DI PAGINAZIONE ANIMATI (Mostrati solo se c'è più di una pagina) */}
                {totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-16 flex justify-center items-center gap-6"
                    >
                        {/* Box fisso a sinistra per evitare che il testo centrale salti */}
                        <div className="w-36 text-right">
                            {currentPage > 1 && (
                                <Link 
                                    href={`/${lang}/video?page=${currentPage - 1}`} 
                                    className="inline-block px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm text-white"
                                >
                                    ← Precedenti
                                </Link>
                            )}
                        </div>
                        
                        <span className="text-white/50 text-sm min-w-[100px] text-center">
                            Pagina {currentPage} di {totalPages}
                        </span>

                        {/* Box fisso a destra per bilanciare l'allineamento */}
                        <div className="w-36 text-left">
                            {currentPage < totalPages && (
                                <Link 
                                    href={`/${lang}/video?page=${currentPage + 1}`} 
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
