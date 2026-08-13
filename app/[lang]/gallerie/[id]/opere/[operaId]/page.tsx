import { Header } from '@/components/Header';
import OperaDetailView from '@/components/OperaDetailView';
import { client } from '@/sanity/lib/client';
import { Opera } from '@/types';

async function getOpera(operaId: string, lang: string) {
	const query = `*[_type == "opera" && _id == $operaId][0] {
		_id,
		"titolo": traduzioni[language == $lang][0].titolo,
		"descrizione": traduzioni[language == $lang][0].descrizione,
		immagine,
		"audio": select(
			$lang == "it" => coalesce(traduzioni[language == $lang][0].audio, audio),
			traduzioni[language == $lang][0].audio
		) {
			titolo,
			asset->{
			url
		}
	}
}`;
	return await client.fetch(query, { operaId, lang });
}

type Props = {
	params: Promise<{ operaId: string; lang: string; id: string }>;
};

export default async function OperaDetailPage({ params }: Props) {
	const { operaId, lang } = await params;
	const opera: Opera = await getOpera(operaId, lang);

	if (!opera) return <div className="text-white p-8">Opera non trovata</div>;

	return (
		<main className="bg-[#1c1d26] text-white min-h-screen">
			<Header />
			<div className="max-w-6xl mx-auto px-6 py-4">
				<OperaDetailView opera={opera} />
			</div>
		</main>
	);
}
