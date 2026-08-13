import EsposizioniList from '@/components/EsposizioniList';
import { getLocalizedBody, getLocalizedTitle } from '@/lib/localizedContent';
import { client } from '@/sanity/lib/client';
import { Esposizione, LocalizedContentTranslation, PortableContentBlock } from '@/types';

type EsposizioneDocument = Omit<Esposizione, 'titolo' | 'contenuto'> & {
    titolo?: string | null;
    contenuto?: PortableContentBlock[] | null;
    immagini?: Esposizione['immagini'];
    traduzioni?: LocalizedContentTranslation[] | null;
};

export default async function EsposizioniPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ page?: string }> 
}) {  
    const { lang } = await params;
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const limit = 6; // Numero di elementi per pagina
    const offset = (page - 1) * limit;

    const esposizioneDocuments: EsposizioneDocument[] = await client.fetch(`
        *[_type == "esposizione"] | order(data desc) [${offset}...${offset + limit}] {
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

    const esposizioni: Esposizione[] = esposizioneDocuments.map(({ traduzioni, titolo, contenuto, ...item }) => ({
        ...item,
        titolo: getLocalizedTitle(traduzioni, lang, titolo),
        contenuto: getLocalizedBody(traduzioni, lang, contenuto)
    }));

    const total = await client.fetch(`count(*[_type == "esposizione"])`);
    const totalPages = Math.ceil(total / limit);

    return <EsposizioniList initialEsposizioni={esposizioni} currentPage={page} totalPages={totalPages} lang={lang} />;
}
