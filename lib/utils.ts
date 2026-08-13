import { PortableContentBlock, SanityImage } from "@/types";

export function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export const dateLocales = {
  it: 'it-IT',
  en: 'en-US',
  es: 'es-ES',
} as const

export function extractImages(content: PortableContentBlock[] | null | undefined): SanityImage[] {
    const safeContent = Array.isArray(content) ? content : [];
    // Assicurati che l'oggetto filtrato rispetti SanityImage
    return safeContent.filter((block): block is SanityImage => block._type === 'image');
}

export function getDisplayImages(images: SanityImage[] | null | undefined, content: PortableContentBlock[] | null | undefined) {
    const safeImages = Array.isArray(images) ? images : [];
    return safeImages.length > 0 ? safeImages : extractImages(content)
}

export function getPrimaryImage(images: SanityImage[] | null | undefined, content: PortableContentBlock[] | null | undefined) {
    return getDisplayImages(images, content)[0] || null
}
