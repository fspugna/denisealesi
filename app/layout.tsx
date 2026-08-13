import type { Metadata } from "next";
import Script from "next/script";
import 'yet-another-react-lightbox/styles.css';
import "./globals.css";

import { Inter, Playfair_Display } from 'next/font/google';
import { AnalyticsConsent } from '@/components/AnalyticsConsent';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Denise Alesi — Autrice e artista visiva",
  description: "Il sito ufficiale di Denise Alesi: scrittura, fotografia, immagini e ricerca artistica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <Script id="google-consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
        gtag('set', 'ads_data_redaction', true);
      `}</Script>
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
