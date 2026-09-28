'use client'

import {usePathname} from 'next/navigation'
import {CookieSettingsButton} from './CookieSettingsButton'

export function Footer({ lang = 'it' }: { lang?: string }) {
    const pathname = usePathname()
    const isContactsPage = pathname.endsWith('/contatti')
    
    // Puoi definire un piccolo dizionario interno per il footer
    const translations = {
        it: "Tutti i diritti riservati.",
        en: "All rights reserved.",
        es: "Todos los derechos reservados."
    };

    return (
        <footer className={`border-t py-20 ${isContactsPage ? 'border-black/15 bg-[#eee8dc] text-[#20231f]' : 'border-white/10 bg-[#1c1d26] text-white'}`}>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className={`text-sm ${isContactsPage ? 'text-black/55' : 'text-white/60'}`}>
                    © {new Date().getFullYear()} Denise Alesi. {translations[lang as keyof typeof translations] || translations.it}
                </p>
                <CookieSettingsButton lang={lang} theme={isContactsPage ? 'light' : 'dark'} />
            </div>
        </footer>
    );
}
