import type { Metadata } from "next";
import 'yet-another-react-lightbox/styles.css';
import "./globals.css";

import { Inter, Playfair_Display } from 'next/font/google';
import { AnalyticsConsent } from '@/components/AnalyticsConsent';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Denise Alesi - Artista e Creativa",
  description: "Esplora l'universo di Denise Alesi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
