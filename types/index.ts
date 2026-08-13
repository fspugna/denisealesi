import { PortableTextBlock } from '@portabletext/types';

// 1. Tipo base per ogni immagine proveniente da Sanity
export interface SanityImage {
    _type: 'image';
    _key?: string; // Utile per le liste in PortableText
    asset: {
        _ref: string;
    };
    alt?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    crop?: any;    // Sanity li aggiunge automaticamente se usati
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hotspot?: any;
}

// 2. Interfaccia unica per le componenti che renderizzano immagini
export interface PortableImageProps {
    value: SanityImage;
    className?: string;
}

export type PortableContentBlock = PortableTextBlock | SanityImage;

export interface Header {
    ritratto?: SanityImage & {alt?: string};
    citazione?: PortableTextBlock[];
    operaInEvidenza?: {
        immagine?: SanityImage & {alt?: string};
        didascalia?: string;
        titolo?: string;
        sottotitolo?: string;
        testo?: PortableTextBlock[];
    };
}

export interface About {
    titolo: string;
    biografia: PortableTextBlock[];
    foto: SanityImage;
    sfondo: SanityImage;
}

export interface SocialItem {
    nome: string;
    url: string;
}

export interface Contatti {
    telefono?: string;
    email?: string;
    fotoUrl?: string;
    social?: SocialItem[];
}

export interface Notizia {
    _id: string;
    titolo: string;
    data: string;
    immagini?: SanityImage[];
    contenuto: PortableContentBlock[];
}

export interface SanityAudioFile {
    asset?: {
        _ref?: string;
        _type?: string;
        url?: string; // Presente se risolto con GROQ asset->url
    };
    titolo?: string;
}

export interface Opera {
    _id: string;
    titolo: string;
    immagine: SanityImage;
    descrizione: string;
    audio?: SanityAudioFile;
    ordine?: number;
    anno?: number;
    galleriaCollegata?: { _id: string; titolo: string };
    videoCollegato?: { _id: string; titolo: string };
    amazonUrl?: string;
}

export interface Fotografia extends SanityImage {
    didascalia?: string;
}

export interface GalleriaFotografica {
    _id: string;
    titolo: string;
    descrizione?: string;
    data: string;
    fotografie: Fotografia[];
}

export interface VideoTranslation {
    language: string;
    titolo?: string;
}

export interface LocalizedContentTranslation {
    language: string;
    titolo?: string;
    contenuto?: PortableContentBlock[];
}

export interface Video {
    _id: string;
    titolo: string;
    data?: string;
    url: string;
}

export const labelsTranslations = {
    it: {
        heroLine1: 'La sintesi di una riflessione,',
        heroLine2: "la narrazione di un'esperienza.",
        artistLabel: "L'autrice",
        works: 'Opere',
        viewMoreWorks: 'Scopri tutte le opere',
        artworkAlt: "Opera d'arte",
        videos: 'Video',
        viewAllVideos: 'Vedi tutti i video',
        imageFallbackAlt: 'Immagine del contenuto',
        latestNews: 'Ultime Notizie',
        viewAllNews: 'Vedi tutte le notizie',
        contacts: 'Contatti',
        contactDetails: 'Recapiti',
        phone: 'Tel:',
        email: 'Email:',
        socialNetworks: 'Social Network',
    },
    en: {
        heroLine1: 'The synthesis of a reflection,',
        heroLine2: 'the narration of an experience.',
        artistLabel: 'The author',
        works: 'Works',
        viewMoreWorks: 'Discover all works',
        artworkAlt: 'Artwork',
        videos: 'Videos',
        viewAllVideos: 'See all videos',
        imageFallbackAlt: 'Content image',
        latestNews: 'Latest News',
        viewAllNews: 'See all news',
        contacts: 'Contacts',
        contactDetails: 'Contact Details',
        phone: 'Phone:',
        email: 'Email:',
        socialNetworks: 'Social Networks',
    },
    es: {
        heroLine1: 'La sintesis de una reflexion,',
        heroLine2: 'la narracion de una experiencia.',
        artistLabel: 'La autora',
        works: 'Obras',
        viewMoreWorks: 'Descubre todas las obras',
        artworkAlt: 'Obra de arte',
        videos: 'Videos',
        viewAllVideos: 'Ver todos los videos',
        imageFallbackAlt: 'Imagen del contenido',
        latestNews: 'Ultimas Noticias',
        viewAllNews: 'Ver todas las noticias',
        contacts: 'Contactos',
        contactDetails: 'Datos de contacto',
        phone: 'Tel:',
        email: 'Email:',
        socialNetworks: 'Redes Sociales',
    },
} as const
