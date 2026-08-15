'use client'

import Image from 'next/image'
import type {Contatti} from '@/types'
import {FadeIn, FadeUp} from './Animate'

const copy = {
  it: {eyebrow: 'Contatti', title: 'Restiamo in contatto.', intro: 'Per informazioni sulle opere, i libri e i progetti artistici, puoi scrivere direttamente a Denise.', email: 'Scrivi una email', phone: 'Telefono', social: 'Segui Denise'},
  en: {eyebrow: 'Contacts', title: 'Let’s keep in touch.', intro: 'For information about works, books and artistic projects, you can write directly to Denise.', email: 'Send an email', phone: 'Phone', social: 'Follow Denise'},
  es: {eyebrow: 'Contacto', title: 'Sigamos en contacto.', intro: 'Para información sobre obras, libros y proyectos artísticos, puedes escribir directamente a Denise.', email: 'Enviar un correo', phone: 'Teléfono', social: 'Sigue a Denise'},
} as const

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
            “Si racconta con la parola, si racconta con le ombre, si racconta con la luce.”
          </blockquote>}

          {!!contattiData.social?.length && <div className={contattiData.fotoUrl ? 'mt-8' : 'mt-12'}>
            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-white/35">{text.social}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {contattiData.social.map((social) => <a key={social._key || social.url} href={social.url} target="_blank" rel="noopener noreferrer" className="border-b border-white/20 pb-1 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[#c5a46d] hover:text-[#c5a46d]">
                {social.nome}
              </a>)}
            </div>
          </div>}
        </FadeIn>
      </div>
    </div>
  </section>
}
