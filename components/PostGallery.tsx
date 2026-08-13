'use client';
import { urlFor } from '@/sanity/lib/image';
import { SanityImage } from '@/types';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import PortableImage from './PortableImage';

export default function PostGallery({ images, title }: { images: SanityImage[]; title?: string }) {
    const [index, setIndex] = useState(-1);
    const slides = images.map((img) => ({ src: urlFor(img).url() }));

    return (
        <>
            {title ? (
                <h2 className="mb-6 text-xs uppercase tracking-[0.3em] text-white/45 font-mono">
                    {title}
                </h2>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                    <PortableImage
                        key={img._key || i}
                        value={img}
                        className="aspect-square rounded-lg border border-white/10 bg-black/30"
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={slides}
                plugins={[Captions, Zoom]}
				captions={{
					showToggle: true,
					descriptionTextAlign: 'center'
				}}
				zoom={{
					maxZoomPixelRatio: 3, // Ingrandimento massimo basato sui pixel dell'immagine
					scrollToZoom: true    // Abilita lo zoom con la rotella del mouse
				}}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.9)" } }}
            />
        </>
    );
}
