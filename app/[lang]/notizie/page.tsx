import NotizieList from '@/components/NotizieList';
import { getLocalizedBody, getLocalizedTitle } from '@/lib/localizedContent';
import { client } from '@/sanity/lib/client';
import { LocalizedContentTranslation, Notizia, PortableContentBlock } from '@/types';
import { Metadata } from 'next';

type NotiziaDocument = Omit<Notizia, 'titolo' | 'contenuto'> & {
    titolo?: string | null;
    contenuto?: PortableContentBlock[] | null;
    immagini?: Notizia['immagini'];
    traduzioni?: LocalizedContentTranslation[] | null;
};

type Props = {
    params: Promise<{ lang: string }>;
};

// 1. MAPPA DEI METADATI LOCALIZZATI
const metaTranslations = {
    it: {
        title: 'Ultime Notizie ed Eventi',
        description: 'Resta aggiornato su tutte le novità, le mostre d\'arte ed i riconoscimenti internazionali dell\'artista Sandro Frinolli Puzzilli.',
    },
    en: {
        title: 'Latest News and Events',
        description: 'Stay updated on all the latest news, art exhibitions, and international awards of the artist Sandro Frinolli Puzzilli.',
    },
    es: {
        title: 'Últimas Noticias y Eventos',
        description: 'Manténgase al día con las últimas noticias, exposiciones de arte y premios internacionales del artista Sandro Frinolli Puzzilli.',
    },
} as const;

// 2. ESPORTA LA FUNZIONE GENERATEMETADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    
    // Seleziona la lingua corrente, fallback su 'it' se non presente
    const translation = metaTranslations[lang as keyof typeof metaTranslations] || metaTranslations.it;

    return {
        title: `${translation.title} | Sandro Frinolli Puzzilli`,
        description: translation.description,
    };
}

// 3. IL TUO COMPONENTE PAGINA ORIGINALE (Resta invariato)
export default async function NotiziePage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ page?: string }>
}) {    
    const { lang } = await params;
    const resolvedParams = await searchParams;    
    const page = parseInt(resolvedParams.page || '1');
    const limit = 6; 
    const offset = (page - 1) * limit;

    const notiziaDocuments: NotiziaDocument[] = await client.fetch(`
        *[_type == "notizia"] | order(data desc) [${offset}...${offset + limit}] {
            _id,
            titolo,
            data,
            contenuto,
            immagini,
            traduzioni[]{
                language,
                titolo,
                contenuto
            }
        }
    `);

    const notizie: Notizia[] = notiziaDocuments.map(({ traduzioni, titolo, contenuto, ...item }) => ({
        ...item,
        titolo: getLocalizedTitle(traduzioni, lang, titolo),
        contenuto: getLocalizedBody(traduzioni, lang, contenuto)
    }));

    const total = await client.fetch(`count(*[_type == "notizia"])`);
    const totalPages = Math.ceil(total / limit);

    return <NotizieList notizie={notizie} currentPage={page} totalPages={totalPages} lang={lang} />;
}
