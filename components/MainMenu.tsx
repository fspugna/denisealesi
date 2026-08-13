'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

const supportedLanguages = ['it', 'en', 'es'] as const

const menuLabels = {
  it: {index: 'Indice', close: 'Chiudi', home: 'Home', biography: 'Biografia', works: 'Opere', galleries: 'Gallerie fotografiche', videos: 'Video', news: 'Pensieri', contacts: 'Contatti'},
  en: {index: 'Index', close: 'Close', home: 'Home', biography: 'Biography', works: 'Works', galleries: 'Photo galleries', videos: 'Videos', news: 'Thoughts', contacts: 'Contacts'},
  es: {index: 'Índice', close: 'Cerrar', home: 'Inicio', biography: 'Biografía', works: 'Obras', galleries: 'Galerías fotográficas', videos: 'Vídeos', news: 'Pensamientos', contacts: 'Contacto'},
} as const

export default function MainMenu({lang = 'it'}: {lang?: string}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const currentLang = supportedLanguages.includes(segments[0] as typeof supportedLanguages[number]) ? segments[0] : lang
  const labels = menuLabels[currentLang as keyof typeof menuLabels] || menuLabels.it
  const currentPath = pathname.startsWith(`/${currentLang}`) ? pathname.slice(currentLang.length + 1) || '/' : pathname
  const href = (path: string) => `/${currentLang}${path === '/' ? '' : path}`

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const links = [
    [labels.home, '/'], [labels.biography, '/biografia'], [labels.works, '/opere'],
    [labels.galleries, '/gallerie'], [labels.news, '/notizie'],
    [labels.videos, '/video'], [labels.contacts, '/contatti'],
  ] as const

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-[#f4efe5] mix-blend-difference md:px-9 md:py-7">
        <Link href={href('/')} className="font-serif text-xl tracking-[0.08em] md:text-2xl" aria-label="Denise Alesi, home">
          Denise Alesi
        </Link>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.28em]" aria-expanded={isOpen}>
          <span>{isOpen ? labels.close : labels.index}</span>
          <span className="relative block h-3 w-7">
            <span className={`absolute left-0 top-0 h-px w-7 bg-current transition-transform ${isOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-7 bg-current transition-transform ${isOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      <div className={`fixed inset-0 z-40 grid bg-[#1d211d] text-[#f1eadc] transition-[opacity,visibility] duration-500 md:grid-cols-[1fr_2fr] ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="hidden border-r border-white/10 p-10 md:flex md:flex-col md:justify-end">
          <p className="max-w-xs font-serif text-2xl italic leading-relaxed text-white/65">Le parole sono luoghi in cui tornare.</p>
        </div>
        <div className="flex flex-col justify-center px-8 pb-16 pt-28 md:px-20">
          <nav aria-label="Navigazione principale">
            <ol className="space-y-1">
              {links.map(([label, path], index) => (
                <li key={path} className="border-b border-white/10">
                  <Link href={href(path)} onClick={() => setIsOpen(false)} className="group flex items-baseline gap-5 py-3 font-serif text-3xl transition-colors hover:text-[#c5a46d] md:text-5xl">
                    <span className="font-sans text-[9px] tracking-widest text-white/35">{String(index + 1).padStart(2, '0')}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-10 flex gap-5 text-[10px] uppercase tracking-[0.25em] text-white/50">
            {supportedLanguages.map((language) => <Link key={language} onClick={() => setIsOpen(false)} href={`/${language}${currentPath === '/' ? '' : currentPath}`} className={currentLang === language ? 'text-[#c5a46d]' : 'hover:text-white'}>{language}</Link>)}
          </div>
        </div>
      </div>
    </>
  )
}
