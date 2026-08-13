import {CookieSettingsButton} from './CookieSettingsButton'

export function Footer({ lang = 'it' }: { lang?: string }) {
    
    // Puoi definire un piccolo dizionario interno per il footer
    const translations = {
        it: "Tutti i diritti riservati.",
        en: "All rights reserved.",
        es: "Todos los derechos reservados."
    };

    return (
        <footer className="py-20 border-t bg-[#1c1d26] border-white/10">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-white/60 text-sm">
                    © {new Date().getFullYear()} Sandro Frinolli Puzzilli. {translations[lang as keyof typeof translations] || translations.it}
                </p>
                <CookieSettingsButton lang={lang} />
            </div>
        </footer>
    );
}
