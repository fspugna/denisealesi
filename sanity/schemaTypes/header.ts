import {defineArrayMember, defineField, defineType} from 'sanity'

const lineStyleFields = [
    defineField({name: 'carattere', title: 'Carattere', type: 'string', options: {list: [{title: 'Lineare (sans-serif)', value: 'sans'}, {title: 'Con grazie (serif)', value: 'serif'}], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'stile', title: 'Stile', type: 'string', options: {list: [{title: 'Normale', value: 'normale'}, {title: 'Corsivo', value: 'corsivo'}], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'peso', title: 'Peso', type: 'string', options: {list: [{title: 'Leggero', value: 'leggero'}, {title: 'Normale', value: 'normale'}, {title: 'Grassetto', value: 'grassetto'}], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'dimensione', title: 'Dimensione', type: 'string', options: {list: [{title: 'Piccola', value: 'piccola'}, {title: 'Media', value: 'media'}, {title: 'Grande', value: 'grande'}], layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'colore', title: 'Colore', type: 'string', options: {list: [{title: 'Bianco', value: 'bianco'}, {title: 'Bianco tenue', value: 'tenue'}, {title: 'Blu', value: 'blu'}], layout: 'radio'}, validation: (rule) => rule.required()}),
]

export const header = defineType({
    name: 'header',
    title: 'Header Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'traduzioni',
            title: 'Testo introduttivo',
            description: 'Le due parti vengono mostrate su righe separate e con stili diversi.',
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
                                {title: 'Italiano', value: 'it'},
                                {title: 'English', value: 'en'},
                                {title: 'Español', value: 'es'},
                            ],
                        },
                        validation: (rule) => rule.required(),
                    }),
                    defineField({
                        name: 'primaRiga',
                        title: 'Prima riga',
                        type: 'string',
                        description: 'Testo principale con carattere lineare.',
                        validation: (rule) => rule.required(),
                    }),
                    defineField({
                        name: 'secondaRiga',
                        title: 'Seconda riga',
                        type: 'string',
                        description: 'Testo in corsivo con carattere serif.',
                        validation: (rule) => rule.required(),
                    }),
                ],
                preview: {
                    select: {title: 'primaRiga', subtitle: 'language'},
                },
            })],
            validation: (rule) => rule.required().min(1).custom((translations) => {
                const languages = (translations || [])
                    .map((translation) => (translation as {language?: string}).language)
                    .filter(Boolean)

                return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
            }),
        }),
        defineField({
            name: 'stilePrimaRiga',
            title: 'Stile prima riga',
            description: 'Impostazioni condivise da tutte le lingue.',
            type: 'object',
            fields: lineStyleFields,
            initialValue: {carattere: 'sans', stile: 'normale', peso: 'leggero', dimensione: 'grande', colore: 'bianco'},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'stileSecondaRiga',
            title: 'Stile seconda riga',
            description: 'Impostazioni condivise da tutte le lingue.',
            type: 'object',
            fields: lineStyleFields,
            initialValue: {carattere: 'serif', stile: 'corsivo', peso: 'leggero', dimensione: 'grande', colore: 'bianco'},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'fotoHeader',
            title: 'Foto Homepage (Casuali)',
            type: 'array',
            of: [{ type: 'image' }],
            options: {
                layout: 'grid'
            }
        }),
    ],
    preview: {
        select: {
            images: 'fotoHeader',
            title: 'traduzioni.0.primaRiga',
        },
        prepare({images, title}) {
            return {
                title: title || 'Header Homepage',
                subtitle: `${images ? images.length : 0} immagini caricate`,
                media: images && images.length > 0 ? images[0] : undefined,
            }
        },
    },
})
