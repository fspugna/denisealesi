'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const supportedLanguages = ['it', 'en', 'es'] as const
const menuLabels = {
    it: {
        home: 'Home',
        about: 'Chi è',
        galleries: 'Gallerie',
        videos: 'Video',
        exhibitions: 'Esposizioni',
        news: 'Notizie',
        reviews: 'Recensioni',
        contatti: 'Contatti',
    },
    en: {
        home: 'Home',
        about: 'Who is',
        galleries: 'Galleries',
        videos: 'Videos',
        exhibitions: 'Exhibitions',
        news: 'News',
        reviews: 'Reviews',
        contatti: 'Contacts',
    },
    es: {
        home: 'Inicio',
        about: 'Quién es',
        galleries: 'Galerias',
        videos: 'Videos',
        exhibitions: 'Exposiciones',
        news: 'Noticias',
        reviews: 'Reseñas',
        contatti: 'Contacto',
    },
} as const

export default function MainMenu({ lang = 'it' }: { lang?: string }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentLang = supportedLanguages.includes(pathSegments[0] as typeof supportedLanguages[number])
        ? pathSegments[0]
        : lang
    const labels = menuLabels[currentLang as keyof typeof menuLabels] ?? menuLabels.it
    const currentPath = currentLang && pathname.startsWith(`/${currentLang}`)
        ? pathname.slice(currentLang.length + 1) || '/'
        : pathname

    // Rileva lo scroll della pagina
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Blocca lo scroll dello sfondo quando il menu è aperto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getLocalizedHref = (path: string) => `/${currentLang}${path === '/' ? '' : path}`;

    return (
        <nav 
            className={`left-0 w-full z-50 px-4 md:px-8 transition-[background-color,padding,box-shadow] duration-300 flex justify-between items-center text-white ${
                isOpen || isScrolled 
                    ? "fixed top-0 bg-[#1c1d26] py-4 shadow-lg" 
                    : "absolute top-0 bg-transparent py-6 md:py-8"
            }`}
        >
            {/* Logo */}
            <div className="relative h-8 md:h-12 w-auto shrink-0 z-50">
                <Link href={getLocalizedHref('/')} className="block relative w-full h-full">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Sandro Frinolli Puzzilli"
                        width={300}
                        height={80}
                        className="object-contain h-full w-auto"
                        priority
                    />
                </Link>
            </div>

            {/* --- DESKTOP MENU --- */}
            <ul className="hidden md:flex items-center gap-x-6 text-[11px] uppercase tracking-widest opacity-90">
                <li><Link href={getLocalizedHref('/')} className="hover:text-blue-400 transition-colors">{labels.home}</Link></li>
                <li><Link href={getLocalizedHref('/about')} className="hover:text-blue-400 transition-colors">{labels.about}</Link></li>
                <li><Link href={getLocalizedHref('/gallerie')} className="hover:text-blue-400 transition-colors">{labels.galleries}</Link></li>
                <li><Link href={getLocalizedHref('/video')} className="hover:text-blue-400 transition-colors">{labels.videos}</Link></li>
                <li><Link href={getLocalizedHref('/esposizioni')} className="hover:text-blue-400 transition-colors">{labels.exhibitions}</Link></li>
                <li><Link href={getLocalizedHref('/notizie')} className="hover:text-blue-400 transition-colors">{labels.news}</Link></li>
                <li><Link href={getLocalizedHref('/recensioni')} className="hover:text-blue-400 transition-colors">{labels.reviews}</Link></li>
                <li><Link href={getLocalizedHref('/contatti')} className="hover:text-blue-400 transition-colors">{labels.contatti}</Link></li>
            </ul>

            {/* Selettore Lingue Desktop */}
            <div className="hidden md:flex gap-3 text-[10px] uppercase tracking-[0.2em] opacity-60">
                {['it', 'en', 'es'].map((l) => (
                    <Link 
                        key={l} 
                        href={`/${l}${currentPath === '/' ? '' : currentPath}`}
                        className={`${currentLang === l ? 'text-white border-b border-white' : 'hover:text-white'}`}
                    >
                        {l}
                    </Link>
                ))}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden z-50 p-2 text-white focus:outline-none"
                aria-label="Toggle menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between items-center relative">
                    <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
            </button>

            {/* --- MOBILE MENU OVERLAY --- */}
            <div 
                className={`fixed inset-0 h-screen w-screen bg-[#1c1d26] z-40 flex flex-col justify-center items-center gap-6 md:hidden transition-all duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <ul className="flex flex-col items-center gap-5 text-sm uppercase tracking-widest text-center">
                    <li><Link href={getLocalizedHref('/')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.home}</Link></li>
                    <li><Link href={getLocalizedHref('/about')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.about}</Link></li>
                    <li><Link href={getLocalizedHref('/gallerie')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.galleries}</Link></li>
                    <li><Link href={getLocalizedHref('/video')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.videos}</Link></li>
                    <li><Link href={getLocalizedHref('/esposizioni')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.exhibitions}</Link></li>
                    <li><Link href={getLocalizedHref('/notizie')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.news}</Link></li>
                    <li><Link href={getLocalizedHref('/recensioni')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.reviews}</Link></li>
                    <li><Link href={getLocalizedHref('/contatti')} onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">{labels.contatti}</Link></li>
                </ul>

                {/* Selettore Lingue Mobile */}
                <div className="flex gap-6 text-xs uppercase tracking-[0.2em] opacity-80 pt-4 border-t border-white/10">
                    {['it', 'en', 'es'].map((l) => (
                        <Link 
                            key={l} 
                            href={`/${l}${currentPath === '/' ? '' : currentPath}`}
                            onClick={() => setIsOpen(false)}
                            className={`${currentLang === l ? 'text-white border-b border-white font-bold' : 'hover:text-white'}`}
                        >
                            {l}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}