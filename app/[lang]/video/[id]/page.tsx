import AltriVideo from '@/components/AltriVideo';
import { FadeUp } from '@/components/Animate';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import {getLocalizedVideoTitle, getVideoEmbedUrl} from '@/lib/video';
import { client } from '@/sanity/lib/client';
import { Video, VideoTranslation } from '@/types';

type VideoDocument = Omit<Video, 'titolo'> & {
    traduzioni?: VideoTranslation[] | null;
    titolo?: string | null;
};

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
    const { id, lang } = await params;
    
    const videoDocument: VideoDocument | null = await client.fetch(`
        *[_type == "video" && _id == $id][0]{
            _id,
            titolo,
            traduzioni[]{
                language,
                titolo
            },
            data,
            url
        }
    `, { id });

    if (!videoDocument) return <div>Video non trovato</div>;

    const video: Video = {
        ...videoDocument,
        titolo: getLocalizedVideoTitle(videoDocument.traduzioni, lang, videoDocument.titolo)
    };

    const embedUrl = getVideoEmbedUrl(video.url);

    return (
        <main className="bg-[#1c1d26] min-h-screen text-white">
            <Header />
            <section className="max-w-5xl mx-auto px-6 py-16">
                
                {/* 1. Il titolo si eleva morbidamente all'apertura */}
                <FadeUp>
                    <h1 className="text-3xl md:text-4xl font-serif mb-8">{video.titolo}</h1>
                </FadeUp>
                
                {/* 2. L'iframe del video subentra subito dopo con un leggero delay */}
                <FadeUp delay={0.25}>
                    {embedUrl ? <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                            className="w-full h-full"
                            src={embedUrl}
                            title={video.titolo}
                            allowFullScreen
                        ></iframe>
                    </div> : <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/30 px-6 py-3 text-sm hover:bg-white/10">Apri il video originale</a>}

                    {video.data && (
                        <p className="mt-8 text-white/60">
                            Pubblicato il: {new Date(video.data).toLocaleDateString()}
                        </p>
                    )}
                </FadeUp>                                
                
                {/* 4. La sezione dei video correlati emerge quando l'utente la raggiunge */}
                <FadeUp delay={0.45} className="mt-12">
                    <AltriVideo currentId={id} lang={lang} />
                </FadeUp>
            </section>                        
        </main>
    );
}
