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

export interface HeroLineStyle {
    carattere?: 'sans' | 'serif';
    stile?: 'normale' | 'corsivo';
    peso?: 'leggero' | 'normale' | 'grassetto';
    dimensione?: 'piccola' | 'media' | 'grande';
    colore?: 'bianco' | 'tenue' | 'blu';
}

export interface Header {
    fotoHeader: SanityImage[];
    primaRiga?: string;
    secondaRiga?: string;
    stilePrimaRiga?: HeroLineStyle;
    stileSecondaRiga?: HeroLineStyle;
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
    telefono: string;
    email: string;
    fotoUrl: string;
    social: SocialItem[];
}

export interface Esposizione {
    _id: string;
    titolo: string;
    data: string;
    immagini?: SanityImage[];
    contenuto: PortableContentBlock[];
}

export interface Notizia {
    _id: string;
    titolo: string;
    data: string;
    immagini?: SanityImage[];
    contenuto: PortableContentBlock[];
}

export interface Recensione {
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
}

export interface Galleria {
    _id: string;
    ordine?: number;
    mostraInHomepage?: boolean;
    nome: string;
    opere: Opera[];
    copertina: SanityImage;
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

export interface HomeData {
    header: Header;
    about: About;
    gallerie: Galleria[];
    totaleGallerie: number;
    video?: Video;
    esposizioni: Esposizione[];
    notizie: Notizia[];
    recensioni: Recensione[];
    contatti: Contatti;
}

export const labelsTranslations = {
    it: {
        heroLine1: 'La sintesi di una riflessione,',
        heroLine2: "la narrazione di un'esperienza.",
        artistLabel: "L'Artista",
        galleries: 'Gallerie',
        viewMoreGalleries: 'Vedi altre gallerie',
        artworkAlt: "Opera d'arte",
        videos: 'Video',
        viewAllVideos: 'Vedi tutti i video',
        imageFallbackAlt: 'Immagine del contenuto',
        exhibitions: 'Esposizioni',
        viewAllExhibitions: 'Vedi tutte le esposizioni',
        latestNews: 'Ultime Notizie',
        viewAllNews: 'Vedi tutte le notizie',
        reviews: 'Recensioni',
        readFullReview: 'Leggi lo scritto completo',
        viewAllReviews: 'Vedi tutte le recensioni',
        contacts: 'Contatti',
        contactDetails: 'Recapiti',
        phone: 'Tel:',
        email: 'Email:',
        socialNetworks: 'Social Network',
    },
    en: {
        heroLine1: 'The synthesis of a reflection,',
        heroLine2: 'the narration of an experience.',
        artistLabel: 'The Artist',
        galleries: 'Galleries',
        viewMoreGalleries: 'See more galleries',
        artworkAlt: 'Artwork',
        videos: 'Videos',
        viewAllVideos: 'See all videos',
        imageFallbackAlt: 'Content image',
        exhibitions: 'Exhibitions',
        viewAllExhibitions: 'See all exhibitions',
        latestNews: 'Latest News',
        viewAllNews: 'See all news',
        reviews: 'Reviews',
        readFullReview: 'Read the full text',
        viewAllReviews: 'See all reviews',
        contacts: 'Contacts',
        contactDetails: 'Contact Details',
        phone: 'Phone:',
        email: 'Email:',
        socialNetworks: 'Social Networks',
    },
    es: {
        heroLine1: 'La sintesis de una reflexion,',
        heroLine2: 'la narracion de una experiencia.',
        artistLabel: 'El Artista',
        galleries: 'Galerias',
        viewMoreGalleries: 'Ver más galerías',
        artworkAlt: 'Obra de arte',
        videos: 'Videos',
        viewAllVideos: 'Ver todos los videos',
        imageFallbackAlt: 'Imagen del contenido',
        exhibitions: 'Exposiciones',
        viewAllExhibitions: 'Ver todas las exposiciones',
        latestNews: 'Ultimas Noticias',
        viewAllNews: 'Ver todas las noticias',
        reviews: 'Resenas',
        readFullReview: 'Leer el texto completo',
        viewAllReviews: 'Ver todas las resenas',
        contacts: 'Contactos',
        contactDetails: 'Datos de contacto',
        phone: 'Tel:',
        email: 'Email:',
        socialNetworks: 'Redes Sociales',
    },
} as const
