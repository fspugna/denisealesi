import {urlFor} from '@/sanity/lib/image'
import type {Opera} from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function OperaGrid({opere, lang}: {opere: Opera[]; lang: string}) {
  const ebookLabel = lang === 'en' ? 'E-book available on Amazon' : lang === 'es' ? 'E-book disponible en Amazon' : 'E-book disponibile su Amazon'

  return (
    <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
      {opere.map((opera, index) => (
        <Link key={opera._id} href={`/${lang}/opere/${opera._id}`} className="group flex h-full flex-col">
          <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-[#d8d0c2]">
            {opera.immagine ? (
              <Image
                src={opera.categoria === 'letteraria'
                  ? urlFor(opera.immagine).ignoreImageParams().width(1100).url()
                  : urlFor(opera.immagine).width(900).height(1125).fit('crop').url()}
                alt={opera.titolo || 'Opera'}
                fill
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`${opera.categoria === 'letteraria' ? 'object-contain p-2' : 'object-cover'} transition duration-700 group-hover:scale-[1.025]`}
              />
            ) : null}
          </div>
          <div className="flex min-h-16 items-start justify-between gap-4 border-t border-black/20 pt-4">
            <div>
              <h2 className="font-serif text-2xl">{opera.titolo}</h2>
              {opera.amazonFormato === 'ebook' ? <p className="mt-3 text-[9px] uppercase tracking-[0.22em] text-black/45">{ebookLabel}</p> : null}
            </div>
            {opera.anno ? <span className="shrink-0 text-[9px] tracking-widest text-black/45">{opera.anno}</span> : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
