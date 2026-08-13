"use client";
import Image from "next/image";
import { FadeIn, FadeUp } from "./Animate";
import { Contatti, labelsTranslations } from "@/types";
import { SocialItem } from "@/types";
import { motion } from 'framer-motion';

interface ContattiProps {
    contattiData: Contatti | null,
    lang: string
}

export default function ContactsView({ contattiData, lang }: ContattiProps) {

    if (!contattiData) return null;

    const t = labelsTranslations[lang as keyof typeof labelsTranslations] || labelsTranslations.it;

    return (
        <section id="contatti" className="py-4 py-md-28 px-6 bg-[#1a1b26]/90 backdrop-blur-md text-white">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif mb-16 text-white"
                    >
                        {t.contacts}
                    </motion.h1>

                    <div className="space-y-8">
                        <FadeUp delay={0.15}>
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4 font-mono">{t.contactDetails}</h3>
                                <div className="space-y-3 text-lg font-light">
                                    {contattiData.telefono && <p className="flex items-center">
                                        <span className="opacity-20 w-20 text-xs uppercase tracking-wider font-mono">{t.phone}</span>
                                        <a href={`tel:${contattiData.telefono}`} className="hover:text-blue-400 transition-colors font-light">{contattiData.telefono}</a>
                                    </p>}
                                    {contattiData.email && <p className="flex items-center">
                                        <span className="opacity-20 w-20 text-xs uppercase tracking-wider font-mono">{t.email}</span>
                                        <a href={`mailto:${contattiData.email}`} className="hover:text-blue-400 transition-colors text-base md:text-lg font-light break-all">{contattiData.email}</a>
                                    </p>}
                                </div>
                            </div>
                        </FadeUp>

                        <FadeUp delay={0.3}>
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-6 font-mono">{t.socialNetworks}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(contattiData.social || []).map((s: SocialItem) => (
                                        <a
                                            key={s.nome}
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 border border-white/5 rounded text-[10px] uppercase tracking-widest bg-white/[0.02] hover:bg-white hover:text-[#1a1b26] hover:border-white transition-all duration-400"
                                        >
                                            {s.nome}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>

                {contattiData.fotoUrl && <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-black/20 border border-white/5 shadow-2xl group">
                    <FadeIn delay={0.2}>
                        <Image
                            src={contattiData.fotoUrl}
                            alt="Denise Alesi"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-all duration-1000 ease-in-out grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-102"
                        />
                    </FadeIn>
                </div>}
            </div>
        </section>
    );
}
