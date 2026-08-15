'use client'

import Image from 'next/image'
import {PortableText} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {About, labelsTranslations} from '@/types'
import type {PortableTextBlock, PortableTextSpan} from '@portabletext/types'
import {FadeIn, FadeUp} from './Animate'

interface AboutProps {
  aboutData: About
  lang: string
}

const contextCopy = {
  it: 'Scrittura, fotografia e ricerca artistica',
  en: 'Writing, photography and artistic research',
  es: 'Escritura, fotografía e investigación artística',
} as const

function emphasizeAuthorName(blocks: PortableTextBlock[]) {
  return blocks.map((block, blockIndex) => {
    if (blockIndex !== 0 || block._type !== 'block') return block

    let nameFound = false
    const children = block.children.flatMap((child) => {
      if (nameFound || child._type !== 'span') return [child]

      const span = child as PortableTextSpan
      const name = 'Denise Alesi'
      const nameStart = span.text.indexOf(name)
      if (nameStart === -1) return [child]

      nameFound = true
      const before = span.text.slice(0, nameStart)
      const after = span.text.slice(nameStart + name.length)

      return [
        ...(before ? [{...span, _key: `${span._key}-before`, text: before}] : []),
        {...span, _key: `${span._key}-name`, text: name, marks: [...(span.marks ?? []), 'strong']},
        ...(after ? [{...span, _key: `${span._key}-after`, text: after}] : []),
      ]
    })

    return {...block, children}
  })
}

export default function AboutView({aboutData, lang}: AboutProps) {
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const t = labelsTranslations[language]
  const biography = emphasizeAuthorName(aboutData.biografia)

  return <section id="biografia" className="relative overflow-hidden px-6 pb-24 pt-32 md:px-8 md:pb-36 md:pt-40">
    {aboutData.sfondo && <>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(${urlFor(aboutData.sfondo).url()})`,
          backgroundAttachment: 'fixed',
          maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#1c1d26]/80" />
    </>}

    <div className="relative z-10 mx-auto max-w-7xl">
      <FadeUp className="mb-12 border-b border-white/15 pb-10 md:mb-16 md:flex md:items-end md:justify-between">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.42em] text-blue-300/70">{t.artistLabel}</p>
          <h1 className="font-serif text-5xl leading-none tracking-tight text-white md:text-7xl">
            {aboutData.titolo || 'Biografia'}
          </h1>
        </div>
        <p className="mt-6 max-w-xs text-sm leading-6 text-white/45 md:mt-0 md:text-right">
          {contextCopy[language]}
        </p>
      </FadeUp>

      <div className="grid items-start gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
        {aboutData.foto && <FadeIn className="md:sticky md:top-28 md:col-span-5">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden bg-black/20">
              <Image
                src={urlFor(aboutData.foto).width(1000).height(1250).fit('crop').url()}
                alt="Ritratto di Denise Alesi"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 42vw"
                className="object-cover object-top grayscale-[15%]"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span className="h-px w-10 bg-white/25" /> Denise Alesi
            </figcaption>
          </figure>
        </FadeIn>}

        <FadeUp delay={0.15} className={aboutData.foto ? 'md:col-span-7' : 'md:col-span-8 md:col-start-3'}>
          <div className="space-y-6 text-base font-light leading-[1.8] text-white/75 md:text-lg [&_strong]:font-semibold [&_strong]:text-white/95">
            <PortableText value={biography} />
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
}
