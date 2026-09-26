'use client'

import Image from 'next/image'
import type {Contatti} from '@/types'
import {FadeIn, FadeUp} from './Animate'

const copy = {
  it: {eyebrow: 'Contatti', title: 'Restiamo in contatto.', intro: 'Per informazioni sulle opere, i libri e i progetti artistici, puoi scrivere direttamente a Denise.', email: 'Scrivi una email', phone: 'Telefono', social: 'Segui Denise'},
  en: {eyebrow: 'Contacts', title: 'Let’s keep in touch.', intro: 'For information about works, books and artistic projects, you can write directly to Denise.', email: 'Send an email', phone: 'Phone', social: 'Follow Denise'},
  es: {eyebrow: 'Contacto', title: 'Sigamos en contacto.', intro: 'Para información sobre obras, libros y proyectos artísticos, puedes escribir directamente a Denise.', email: 'Enviar un correo', phone: 'Teléfono', social: 'Sigue a Denise'},
} as const

function SocialIcon({name, url}: {name: string; url: string}) {
  const platform = `${name} ${url}`.toLowerCase()
  const iconClass = 'size-5 shrink-0'

  if (platform.includes('instagram')) return <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
  if (platform.includes('youtube')) return <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 12c0 3-.35 5.1-.9 5.7-.7.8-4.2 1.1-8.1 1.1s-7.4-.3-8.1-1.1C3.35 17.1 3 15 3 12s.35-5.1.9-5.7C4.6 5.5 8.1 5.2 12 5.2s7.4.3 8.1 1.1C20.65 6.9 21 9 21 12Z" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg>
  if (platform.includes('facebook')) return <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="currentColor"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.7c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.2H8V13h2.5v8h3.2Z" /></svg>

  return <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full border border-current text-[10px]">↗</span>
}

export default function ContactsView({contattiData, lang}: {contattiData: Contatti | null; lang: string}) {
  if (!contattiData) return null
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const text = copy[language]

  return <section id="contatti" className="border-t border-white/10 bg-[#20251f] px-6 py-24 text-[#eee8dc] sm:px-10 lg:py-36">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 flex items-center gap-5 text-[#c5a46d]">
        <span className="text-[9px] uppercase tracking-[0.34em]">{text.eyebrow}</span>
        <span className="h-px flex-1 bg-current opacity-30" />
      </div>

      <div className={`grid items-start gap-14 ${contattiData.fotoUrl ? 'lg:grid-cols-[1.15fr_0.7fr] lg:gap-[10vw]' : 'lg:grid-cols-[1.1fr_0.9fr] lg:gap-[12vw]'}`}>
        <FadeUp>
          <h2 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{text.title}</h2>
          <p className="mt-8 max-w-xl text-base font-light leading-7 text-white/60 md:text-lg">{text.intro}</p>

          {contattiData.email && <a href={`mailto:${contattiData.email}`} className="group mt-12 block border-b border-white/20 pb-5 transition-colors hover:border-[#c5a46d]">
            <span className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#c5a46d]">{text.email}</span>
            <span className="flex items-center justify-between gap-5 font-serif text-[clamp(1.35rem,3.5vw,3rem)] leading-tight">
              <span className="break-all">{contattiData.email}</span>
              <span className="shrink-0 text-2xl transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
          </a>}

          {contattiData.telefono && <div className="mt-8">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.3em] text-white/35">{text.phone}</span>
            <a href={`tel:${contattiData.telefono}`} className="font-serif text-2xl transition-colors hover:text-[#c5a46d]">{contattiData.telefono}</a>
          </div>}
        </FadeUp>

        <FadeIn delay={0.15}>
          {contattiData.fotoUrl ? <figure>
            <div className="relative aspect-[4/5] overflow-hidden bg-black/15">
              <Image src={contattiData.fotoUrl} alt={contattiData.fotoAlt || 'Denise Alesi'} fill sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover grayscale-[20%]" />
            </div>
          </figure> : <blockquote className="border-l border-[#c5a46d]/50 pl-7 font-serif text-2xl italic leading-relaxed text-white/55">
            “Le parole sono luoghi in cui tornare”.
          </blockquote>}

          {!!contattiData.social?.length && <div className={contattiData.fotoUrl ? 'mt-8' : 'mt-12'}>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/50">{text.social}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {contattiData.social.map((social) => <a key={social._key || social.url} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-b border-white/20 pb-2 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[#c5a46d] hover:text-[#c5a46d]">
                <SocialIcon name={social.nome} url={social.url} />
                <span>{social.nome}</span>
              </a>)}
            </div>
          </div>}
        </FadeIn>
      </div>
    </div>
  </section>
}
