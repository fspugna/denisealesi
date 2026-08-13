import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Galleria } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function AltreGallerie({ currentId, lang }: { currentId: string; lang: string }) {
    const altreGallerie = await client.fetch(`
        *[_type == "galleria" && _id != $currentId] | order(ordine asc, _id asc)[0...3] {
            _id,
            "nome": coalesce(traduzioni[language == $lang][0].nome, traduzioni[0].nome, nome),
            "copertina": copertina->immagine
        }
    `, { currentId, lang });

    if (!altreGallerie || altreGallerie.length === 0) return null;

    return (
        <section className="mt-24 border-t border-white/10 pt-4">
            <h3 className="text-2xl font-serif mb-10 text-white">Altre gallerie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {altreGallerie.map((g: Galleria) => (
                    <Link key={g._id} href={`/${lang}/gallerie/${g._id}`} className="group relative block overflow-hidden rounded-lg aspect-[16/9] bg-[#272833]">
                        {g.copertina && (
                            <Image
                                src={urlFor(g.copertina).url()}
                                alt={g.nome}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                            <span className="font-serif text-lg tracking-wide">{g.nome}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
