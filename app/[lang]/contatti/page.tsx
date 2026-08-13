import { FadeIn, FadeUp } from '@/components/Animate';
import { Header } from '@/components/Header';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';
import { Contatti, labelsTranslations, SocialItem } from '@/types';
import Image from 'next/image';
import ContactsView from '@/components/ContactsView';

async function getContattiData(): Promise<Contatti | null> {
    return await client.fetch(`*[_type == "contatti"][0]{
      telefono,
      email,
      "fotoUrl": foto.asset->url,
      social    
  }`)
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const contattiData = await getContattiData();    

    return (
        <main className="bg-[#1c1d26] text-white relative min-h-screen selection:bg-blue-500/30">

            <Header />

            <ContactsView contattiData={contattiData} lang={lang} />
        </main>
    );
}
