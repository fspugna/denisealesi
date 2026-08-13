import AltreGallerie from '@/components/AltreGallerie';
import { FadeUp } from '@/components/Animate';
import GalleriaView from '@/components/GalleriaView'; // Importa il componente client
import { Header } from '@/components/Header';
import { client } from '@/sanity/lib/client';

import { Metadata } from 'next'; // Se usi TypeScript

type Props = {
    params: Promise<{ id: string; lang: string }>;
};

// 1. ESPORTA LA FUNZIONE GENERATEMETADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, lang } = await params;

    // Esegui la stessa identica query (Next.js fa il caching automatico del fetch)
    const galleria = await client.fetch(`
        *[_type == "galleria" && _id == $id][0] {
            _id,
            "nome": coalesce(traduzioni[language == $lang][0].nome, traduzioni[0].nome, nome)
        }
    `, { id, lang });

    if (!galleria) {
        return { title: 'Galleria non trovata' };
    }

    return {
        title: `${galleria.nome} | Sandro Frinolli Puzzilli`,
        description: `Esplora la galleria d'arte "${galleria.nome}" di Sandro Frinolli Puzzilli. Scopri la collezione di opere e dipinti dell'artista.`,
    };
}

// 2. IL TUO COMPONENTE PAGINA ORIGINALE (Resta invariato)
export default async function GalleriaPage({ params }: Props) {
    const { id, lang } = await params;

    // 1. Esegui la query QUI (Server Side)
    const galleria = await client.fetch(`
        *[_type == "galleria" && _id == $id][0] {
            _id,
            "nome": coalesce(traduzioni[language == $lang][0].nome, traduzioni[0].nome, nome),
            "opere": opere[]->{
                _id,
                "titolo": coalesce(traduzioni[language == $lang][0].titolo, traduzioni[0].titolo, titolo),
                immagine,
                "descrizione": coalesce(traduzioni[language == $lang][0].descrizione, traduzioni[0].descrizione, descrizione)
            }
        }
    `, { id, lang });

    if (!galleria) return <main>Galleria non trovata</main>;

    // 2. Passa i dati al componente client avvolti dai blocchi FadeUp
    return (
        <main className="bg-[#1c1d26] min-h-screen text-white">
            <Header />
            <section className="max-w-7xl mx-auto px-6 py-16">

                {/* Griglia a due colonne asimmetriche su desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Colonna principale (Galleria e Opere) */}
                    <div className="lg:col-span-3">
                        {/* Il titolo della galleria sale morbidamente all'avvio della pagina */}
                        <FadeUp>
                            <h1 className="text-4xl md:text-5xl font-serif mb-6">{galleria.nome}</h1>
                        </FadeUp>

                        {/* La griglia delle opere d'arte entra subito dopo con un leggero delay */}
                        <FadeUp delay={0.25}>
                            <GalleriaView galleria={galleria} />
                        </FadeUp>
                    </div>

                    {/* Barra laterale (Altre Gallerie) */}
                    <div className="lg:col-span-1">
                        {/* sticky e top-24 mantengono la barra laterale visibile durante lo scroll se la galleria è molto lunga */}
                        <div className="lg:sticky lg:top-24">
                            <FadeUp delay={0.4}>
                                <AltreGallerie currentId={id} lang={lang} />
                            </FadeUp>
                        </div>
                    </div>

                </div>

            </section>
        </main>
    );
}
