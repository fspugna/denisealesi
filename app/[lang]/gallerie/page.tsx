import { client } from '@/sanity/lib/client';
import GallerieList from '@/components/GallerieList';
import { Galleria } from '@/types';

type GalleriaDocument = Galleria & {
    traduzioni?: Array<{
        language?: string | null;
        nome?: string | null;
    }> | null;
};

export default async function GalleriePage({ 
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
    const limit = 6; // Numero di gallerie per pagina
    const offset = (page - 1) * limit;

    const galleriaDocuments: GalleriaDocument[] = await client.fetch(`
        *[_type == "galleria"] | order(ordine asc, _id asc) [${offset}...${offset + limit}] {
            _id,
            "nome": coalesce(traduzioni[language == $lang][0].nome, traduzioni[0].nome, nome),
            "copertina": copertina->immagine, 
            opere[]->{ _id }
        }
    `, { lang });

    // 2. Conta il numero complessivo di gallerie per determinare il numero totale di pagine
    const total = await client.fetch(`count(*[_type == "galleria"])`);
    const totalPages = Math.ceil(total / limit);

    return <GallerieList initialGallerie={galleriaDocuments} currentPage={page} totalPages={totalPages} lang={lang} />;
}
