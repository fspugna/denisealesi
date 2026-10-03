import {defineField} from 'sanity'

type TranslationWithTitle = {
  language?: string
  titolo?: string
}

export function slugifyContentTitle(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export const contentSlugField = defineField({
  name: 'slug',
  title: 'Indirizzo della pagina',
  type: 'slug',
  description: 'Parte leggibile dell’URL pubblico. Dopo la pubblicazione, cambiala solo se necessario: il vecchio indirizzo non verrà più generato automaticamente.',
  options: {
    source: (document) => {
      const translations = Array.isArray(document.traduzioni)
        ? document.traduzioni as TranslationWithTitle[]
        : []
      return translations.find((translation) => translation.language === 'it')?.titolo
        || translations[0]?.titolo
        || ''
    },
    slugify: slugifyContentTitle,
  },
  validation: (rule) => rule.required(),
})
