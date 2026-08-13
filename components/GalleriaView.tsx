'use client';
import { urlFor } from '@/sanity/lib/image';
import { Galleria, Opera } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export type GalleriaViewProps = {
	galleria: Galleria;
}

export default function GalleriaView({ galleria }: { galleria: Galleria }) {
	const params = useParams();
	const lang = params?.lang || 'it';

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{galleria.opere?.map((opera: Opera) => (
				<Link
					key={opera._id}
					href={`/${lang}/gallerie/${galleria._id}/opere/${opera._id}`}
					className="group block cursor-pointer"
				>
					<div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#272833]">
						{opera.immagine && (
							<Image
								src={urlFor(opera.immagine).url()}
								alt={opera.titolo || "Opera"}
								width={600}
								height={800}
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						)}
					</div>
					<h2 className="mt-4 text-sm uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
						{opera.titolo}
					</h2>
					<p className="text-sm text-[#9ca9af] line-clamp-2">
						{opera.descrizione || ""}
					</p>
				</Link>
			))}
		</div>
	);
}