import RecensioniList from '@/components/RecensioniList';
import { getLocalizedBody, getLocalizedTitle } from '@/lib/localizedContent';
import { client } from '@/sanity/lib/client';
import { LocalizedContentTranslation, PortableContentBlock, Recensione } from '@/types';

type RecensioneDocument = Omit<Recensione, 'titolo' | 'contenuto'> & {
    titolo?: string | null;
    contenuto?: PortableContentBlock[] | null;
    immagini?: Recensione['immagini'];
    traduzioni?: LocalizedContentTranslation[] | null;
};

export default async function RecensioniPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ page?: string }> 
}) {  
    const { lang } = await params;
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const limit = 6; // Numero di recensioni per pagina
    const offset = (page - 1) * limit;

    const recensioneDocuments: RecensioneDocument[] = await client.fetch(`
        *[_type == "recensione"] | order(data desc) [${offset}...${offset + limit}] {
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

    const recensioni: Recensione[] = recensioneDocuments.map(({ traduzioni, titolo, contenuto, ...item }) => ({
        ...item,
        titolo: getLocalizedTitle(traduzioni, lang, titolo),
        contenuto: getLocalizedBody(traduzioni, lang, contenuto)
    }));

    const total = await client.fetch(`count(*[_type == "recensione"])`);
    const totalPages = Math.ceil(total / limit);

    return <RecensioniList initialRecensioni={recensioni} currentPage={page} totalPages={totalPages} lang={lang} />;
}
