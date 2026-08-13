import {defineArrayMember, defineField, defineType} from 'sanity'

export const opera = defineType({
    name: 'opera',
    title: 'Opera',
    type: 'document',
    fields: [        
        defineField({
            name: 'immagine',
            title: 'Immagine',
            type: 'image', // Carichi l'immagine una sola volta qui
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', type: 'string', title: 'Testo alternativo' }),
            ],
        }),
        defineField({
            name: 'audio',
            title: 'Traccia audio non localizzata (deprecata)',
            type: 'file',
            description: 'Campo precedente: usa la traccia audio dentro ogni traduzione.',
            deprecated: {
                reason: 'L’audio ora dipende dalla lingua e va inserito nella relativa traduzione.',
            },
            readOnly: true,
            hidden: ({value}) => value === undefined,
            initialValue: undefined,
            options: {
                accept: 'audio/*',
            },
            fields: [
                defineField({
                    name: 'titolo',
                    type: 'string',
                    title: 'Titolo o etichetta audio (opzionale)',
                    description: 'Es. "Guida all\'ascolto" o "Traccia d\'ambiente"',
                }),
            ],
        }),
        defineField({
            name: 'traduzioni',
            title: 'Traduzioni',
            type: 'array',
            of: [defineArrayMember({
                type: 'object',
                fields: [
                    defineField({
                        name: 'language',
                        title: 'Lingua',
                        type: 'string',
                        options: {
                            list: [
                                { title: 'Italiano', value: 'it' },
                                { title: 'English', value: 'en' },
                                { title: 'Español', value: 'es' }
                            ],
                            // Opzionale: layout: 'radio' lo renderebbe una scelta a pulsanti invece di una tendina
                        },
                        validation: (rule) => rule.required(),
                    }),
                    defineField({name: 'titolo', type: 'string', title: 'Titolo'}),
                    defineField({name: 'descrizione', type: 'text', title: 'Descrizione'}),
                    defineField({
                        name: 'audio',
                        title: 'Traccia audio / Commento sonoro',
                        description: 'Questa traccia viene riprodotta solo per questa lingua.',
                        type: 'file',
                        options: {accept: 'audio/*'},
                        fields: [
                            defineField({
                                name: 'titolo',
                                type: 'string',
                                title: 'Titolo o etichetta audio (opzionale)',
                            }),
                        ],
                    }),
                ],
                preview: {
                    select: {title: 'titolo', subtitle: 'language'},
                },
            })],
            validation: (rule) => rule.custom((translations) => {
                const languages = (translations || [])
                    .map((translation) => (translation as {language?: string}).language)
                    .filter(Boolean)

                return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
            }),
        })
    ],
    preview: {
        select: {
            title: 'traduzioni.0.titolo', // Prende il titolo del primo elemento dell'array (es. l'italiano)
            media: 'immagine',           // Usa il campo immagine come miniatura
        },
        prepare(selection) {
            const { title, media } = selection;
            return {
                title: title || 'Opera senza titolo', // Fallback se il titolo manca
                media: media,
            };
        },
    },
})
