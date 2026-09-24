'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

const supportedLanguages = ['it', 'en', 'es'] as const

const menuLabels = {
  it: {index: 'Indice', close: 'Chiudi', home: 'Home', biography: 'Biografia', literary: 'Opere letterarie', visual: 'Opere visive', galleries: 'Gallerie', contacts: 'Contatti'},
  en: {index: 'Index', close: 'Close', home: 'Home', biography: 'Biography', literary: 'Literary works', visual: 'Visual works', galleries: 'Galleries', contacts: 'Contacts'},
  es: {index: 'Índice', close: 'Cerrar', home: 'Inicio', biography: 'Biografía', literary: 'Obras literarias', visual: 'Obras visuales', galleries: 'Galerías', contacts: 'Contacto'},
} as const

export default function MainMenu({lang = 'it'}: {lang?: string}) {
  const [openPath, setOpenPath] = useState<string | null>(null)
  const pathname = usePathname()
  const isOpen = openPath === pathname
  const segments = pathname.split('/').filter(Boolean)
  const currentLang = supportedLanguages.includes(segments[0] as typeof supportedLanguages[number]) ? segments[0] : lang
  const labels = menuLabels[currentLang as keyof typeof menuLabels] || menuLabels.it
  const currentPath = pathname.startsWith(`/${currentLang}`) ? pathname.slice(currentLang.length + 1) || '/' : pathname
  const href = (path: string) => `/${currentLang}${path === '/' ? '' : path}`

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    const updateBodyScroll = () => {
      document.body.style.overflow = isOpen && !desktopQuery.matches ? 'hidden' : ''
    }

    updateBodyScroll()
    desktopQuery.addEventListener('change', updateBodyScroll)

    return () => {
      desktopQuery.removeEventListener('change', updateBodyScroll)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenPath(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const links = [
    [labels.home, '/'], [labels.biography, '/biografia'], [labels.literary, '/opere-letterarie'],
    [labels.visual, '/opere-visive'], [labels.galleries, '/gallerie'], [labels.contacts, '/contatti'],
  ] as const

  const isActive = (path: string) => path === '/' ? currentPath === '/' : currentPath === path || currentPath.startsWith(`${path}/`)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 hidden min-h-20 items-center border-b border-white/10 bg-[#1d211d]/95 px-7 text-[#f4efe5] shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md lg:flex xl:px-10">
        <nav className="mx-auto" aria-label="Navigazione principale">
          <ul className="flex items-center gap-4 xl:gap-7">
            {links.map(([label, path]) => (
              <li key={path}>
                <Link
                  href={href(path)}
                  aria-current={isActive(path) ? 'page' : undefined}
                  className={`relative block py-8 text-[9px] uppercase tracking-[0.18em] transition-colors xl:text-[10px] xl:tracking-[0.22em] ${isActive(path) ? 'text-[#c5a46d]' : 'text-white/75 hover:text-white'}`}
                >
                  {label}
                  <span className={`absolute inset-x-0 bottom-5 h-px origin-left bg-[#c5a46d] transition-transform ${isActive(path) ? 'scale-x-100' : 'scale-x-0'}`} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </header>

      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-[#f4efe5] mix-blend-difference md:px-9 md:py-7 lg:hidden">
        <Link href={href('/')} className="font-serif text-xl tracking-[0.08em] md:text-2xl" aria-label="Denise Alesi, home">
          Denise Alesi
        </Link>
        <button type="button" onClick={() => setOpenPath(isOpen ? null : pathname)} className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.28em]" aria-expanded={isOpen} aria-controls="mobile-menu">
          <span>{isOpen ? labels.close : labels.index}</span>
          <span className="relative block h-3 w-7">
            <span className={`absolute left-0 top-0 h-px w-7 bg-current transition-transform ${isOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-7 bg-current transition-transform ${isOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`fixed inset-0 z-40 grid bg-[#1d211d] text-[#f1eadc] transition-[opacity,visibility] duration-500 md:grid-cols-[1fr_2fr] lg:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="hidden border-r border-white/10 p-10 md:flex md:flex-col md:justify-end">
          <p className="max-w-xs font-serif text-2xl italic leading-relaxed text-white/65">Le parole sono luoghi in cui tornare.</p>
        </div>
        <div className="flex flex-col justify-center px-8 pb-16 pt-28 md:px-20">
          <nav aria-label="Navigazione principale">
            <ol className="space-y-1">
              {links.map(([label, path], index) => (
                <li key={path} className="border-b border-white/10">
                  <Link href={href(path)} onClick={() => setOpenPath(null)} className="group flex items-baseline gap-5 py-3 font-serif text-3xl transition-colors hover:text-[#c5a46d] md:text-5xl">
                    <span className="font-sans text-[9px] tracking-widest text-white/35">{String(index + 1).padStart(2, '0')}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </>
  )
}
