'use client';

import { About, labelsTranslations } from "@/types";
import { FadeIn, FadeUp } from "./Animate";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";

interface AboutProps {
    aboutData: About;
    lang: string;
}

export default function AboutView({ aboutData, lang }: AboutProps) {

    const t = labelsTranslations[lang as keyof typeof labelsTranslations] || labelsTranslations.it;

    return (
        <section className="pb-16">
            {aboutData && (
                <section id="chi-è" className="relative py-28 border-white/5 overflow-hidden min-h-[600px] flex items-center">
                    {aboutData?.sfondo && (
                        <>
                            <div
                                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${urlFor(aboutData.sfondo).url()})`,
                                    backgroundAttachment: 'fixed',
                                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                                }}
                            />
                            <div className="absolute inset-0 bg-[#1c1d26]/85 backdrop-blur-xs z-0 pointer-events-none" />
                        </>
                    )}

                    {/* Aggiunto px-6 md:px-8 e regolato il gap mobile */}
                    <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full">
                        {/* Foto dell'artista */}
                        <FadeIn>
                            <div className="relative aspect-[4/5] w-full shadow-2xl rounded-lg overflow-hidden border border-white/10 bg-black/20 group">
                                <Image
                                    src={urlFor(aboutData.foto).url()}
                                    alt="Sandro Frinolli Puzzilli"
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out"
                                />
                            </div>
                        </FadeIn>

                        {/* Testo Biografia */}
                        <div className="space-y-6 flex flex-col justify-center">
                            <FadeUp delay={0.2} className="space-y-6">
                                <h2 className="text-sm uppercase tracking-[0.4em] opacity-40 italic text-blue-400">{t.artistLabel}</h2>
                                <h3 className="text-4xl font-serif tracking-wide text-white/95">{aboutData.titolo || "Sandro Frinolli Puzzilli"}</h3>
                                <div className="text-white/80 leading-relaxed font-light text-lg space-y-4">
                                    <PortableText value={aboutData?.biografia} />
                                </div>
                            </FadeUp>
                        </div>
                    </div>
                </section>
            )}
        </section>
    )
}