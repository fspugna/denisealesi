import MainMenu from '@/components/MainMenu';
import { Footer } from '@/components/Footer';

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    // Passiamo la lingua ai componenti che devono cambiare testo
    return (
        <>
            <MainMenu lang={lang} />
            <main className="flex-grow">{children}</main>
            <Footer lang={lang} />
        </>
    );
}
