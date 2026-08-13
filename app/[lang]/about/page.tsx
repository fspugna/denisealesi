import AboutView from '@/components/AboutView';
import { Header } from '@/components/Header';
import { client } from '@/sanity/lib/client';
import { About } from '@/types';
import {defineQuery} from 'next-sanity';

const ABOUT_QUERY = defineQuery(`
    *[_id == "about"][0]{
        "titolo": coalesce(
            traduzioni[language == $lang][0].titolo,
            traduzioni[language == "it"][0].titolo
        ),
        "biografia": coalesce(
            traduzioni[language == $lang][0].biografia,
            traduzioni[language == "it"][0].biografia
        ),
        foto,
        sfondo
    }
`);

async function getAboutData(lang: string): Promise<About> {
    return await client.fetch(ABOUT_QUERY, {lang})
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const aboutData = await getAboutData(lang);   

    return (
        <main className="bg-[#1c1d26] text-white relative min-h-screen selection:bg-blue-500/30">
            <Header />

            <AboutView aboutData={aboutData} lang={lang} />
        </main>
    );
}
