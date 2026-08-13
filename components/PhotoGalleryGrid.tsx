'use client'

import {urlFor} from '@/sanity/lib/image'
import type {Fotografia} from '@/types'
import Image from 'next/image'
import {useState} from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

export default function PhotoGalleryGrid({fotografie}: {fotografie: Fotografia[]}) {
  const [index, setIndex] = useState(-1)
  const slides = fotografie.map((foto) => ({
    src: urlFor(foto).width(2000).fit('max').url(),
    alt: foto.alt,
    description: foto.didascalia,
  }))

  return <>
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {fotografie.map((foto, photoIndex) => {
        const match = foto.asset?._ref?.match(/-(\d+)x(\d+)-[^-]+$/)
        const width = match ? Number(match[1]) : 1200
        const height = match ? Number(match[2]) : 900
        return <figure key={foto._key || photoIndex} className="mb-5 break-inside-avoid">
        <button type="button" onClick={() => setIndex(photoIndex)} className="group block w-full cursor-zoom-in overflow-hidden bg-black/5 text-left">
          <Image
            src={urlFor(foto).width(1200).fit('max').url()}
            alt={foto.alt || foto.didascalia || 'Fotografia'}
            width={width}
            height={height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-auto w-full transition duration-700 group-hover:scale-[1.015]"
          />
        </button>
        {foto.didascalia && <figcaption className="mt-3 text-[10px] leading-relaxed tracking-[0.08em] text-black/50">{foto.didascalia}</figcaption>}
      </figure>})}
    </div>
    <Lightbox open={index >= 0} close={() => setIndex(-1)} index={index} slides={slides} plugins={[Captions, Zoom]} zoom={{maxZoomPixelRatio: 3, scrollToZoom: true}} styles={{container: {backgroundColor: 'rgba(20, 23, 20, 0.97)'}}} />
  </>
}
