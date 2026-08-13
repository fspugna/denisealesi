import { client } from '@/sanity/lib/client';
import { Video } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getYouTubeThumbnail } from '@/lib/video';

export default async function AltriVideo({ currentId, lang }: { currentId: string; lang: string }) {
    const altriVideo = await client.fetch(`
        *[_type == "video" && _id != $currentId] | order(data desc)[0..2] {
            _id,
            "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo, titolo),
            url
        }
    `, { currentId, lang });

    if (!altriVideo || altriVideo.length === 0) return null;

    return (
        <section className="mt-24 border-t border-white/10 pt-16">
            <div className="flex justify-between items-end mb-10">
                <h3 className="text-2xl font-serif text-white">Altri Video</h3>
                <Link href={`/${lang}/video`} className="text-blue-400 hover:text-blue-300 uppercase tracking-widest text-xs transition-colors">
                    Vedi tutti i video →
                </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {altriVideo.map((v: Video) => {
                    const thumbnail = getYouTubeThumbnail(v.url);
                    return (
                        <Link key={v._id} href={`/${lang}/video/${v._id}`} className="group block bg-[#272833] rounded-lg overflow-hidden">
                            <div className="aspect-video relative overflow-hidden">
                                {thumbnail ? (
                                    <Image                                        
                                        src={thumbnail}
                                        alt={v.titolo}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    // Fallback se l'immagine non viene trovata
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <span className="text-xs text-gray-500">Video</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-serif text-sm group-hover:text-blue-400 transition-colors">{v.titolo}</h4>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
