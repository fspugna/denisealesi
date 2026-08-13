import VideoList from '@/components/VideoList';
import { getLocalizedVideoTitle } from '@/lib/video';
import { client } from '@/sanity/lib/client';
import { Video, VideoTranslation } from '@/types';

type VideoDocument = Omit<Video, 'titolo'> & {
    traduzioni?: VideoTranslation[] | null;
    titolo?: string | null;
};

export default async function VideoPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ page?: string }> 
}) {
    const { lang } = await params;
    // Risolviamo i parametri di ricerca dall'URL (Next.js 15+)
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const limit = 6; // Numero di video per pagina
    const offset = (page - 1) * limit;

    // 1. Recupera solo i video associati alla pagina corrente
    const videoDocuments: VideoDocument[] = await client.fetch(`
        *[_type == "video"] | order(data desc) [${offset}...${offset + limit}] {
            _id,
            titolo,
            traduzioni[]{
                language,
                titolo
            },
            url,
            data
        }
    `);

    const video: Video[] = videoDocuments.map(({ traduzioni, titolo, ...item }) => ({
        ...item,
        titolo: getLocalizedVideoTitle(traduzioni, lang, titolo)
    }));

    // 2. Conta il numero complessivo di video per calcolare le pagine totali
    const total = await client.fetch(`count(*[_type == "video"])`);
    const totalPages = Math.ceil(total / limit);

    return <VideoList initialVideos={video} currentPage={page} totalPages={totalPages} lang={lang} />;
}
