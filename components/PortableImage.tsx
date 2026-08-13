'use client';
import { urlFor } from '@/sanity/lib/image';
import { PortableImageProps } from '@/types';
import Image from 'next/image';

interface Props extends PortableImageProps {
    onClick?: () => void;
}

export default function PortableImage({ value, className, onClick }: Props) {
    const imageUrl = urlFor(value).url();

    return (
        <div 
            className={`cursor-pointer overflow-hidden bg-[#1c1d26] ${className || 'my-8'}`} // Aggiunto bg-[#1c1d26]
            onClick={onClick}
        >
            <Image
                src={imageUrl}
                alt={value.alt || "Immagine notizia"}
                width={800}
                height={500}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                priority={false}
            />
        </div>
    );
}