'use client'

import {useEffect, useState} from 'react'

const SHOW_AFTER_PX = 400

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER_PX)

        updateVisibility()
        window.addEventListener('scroll', updateVisibility, {passive: true})

        return () => window.removeEventListener('scroll', updateVisibility)
    }, [])

    return (
        <button
            type="button"
            aria-label="Torna all'inizio della pagina"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            tabIndex={isVisible ? 0 : -1}
            className={`fixed bottom-8 right-8 z-50 p-3 bg-white/10 hover:bg-white text-black rounded-full transition-all duration-300 ${
                isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
        >
            ↑
        </button>
    )
}
