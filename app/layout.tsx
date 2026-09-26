import type { Metadata } from "next";
import 'yet-another-react-lightbox/styles.css';
import "./globals.css";

import { EB_Garamond, Inter } from 'next/font/google';
import { AnalyticsConsent } from '@/components/AnalyticsConsent';

const garamond = EB_Garamond({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Denise Alesi — Autrice e artista visiva",
  description: "Il sito ufficiale di Denise Alesi: scrittura, fotografia, immagini e ricerca artistica.",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${garamond.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
