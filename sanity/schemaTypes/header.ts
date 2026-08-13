import {defineArrayMember, defineField, defineType} from 'sanity'

export const header = defineType({
    name: 'header',
    title: 'Header Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'traduzioni',
            title: 'Testo della homepage',
            description: 'Citazione mostrata sotto il nome. Usa il corsivo per il titolo dell’opera citata.',
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
                        name: 'citazione',
                        title: 'Citazione',
                        type: 'array',
                        of: [defineArrayMember({type: 'block'})],
                        description: 'Inserisci il testo e, in un secondo paragrafo, la fonte. Puoi formattare “Immagini e parole” in corsivo.',
                        validation: (rule) => rule.required().min(1),
                    }),
                ],
                preview: {
                    select: {subtitle: 'language'},
                    prepare: ({subtitle}) => ({title: 'Citazione homepage', subtitle}),
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
            name: 'ritratto',
            title: 'Ritratto homepage',
            description: 'Immagine verticale mostrata nella metà sinistra della homepage.',
            type: 'image',
            options: {hotspot: true},
            fields: [defineField({name: 'alt', type: 'string', title: 'Testo alternativo'})],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'operaInEvidenza',
            title: 'Opera in evidenza sotto la homepage',
            description: 'Sezione editoriale ispirata alla colonna destra del sito precedente.',
            type: 'object',
            fields: [
                defineField({
                    name: 'immagine',
                    title: 'Immagine dell’opera',
                    description: 'Carica l’autoritratto “Thàvma”.',
                    type: 'image',
                    options: {hotspot: true},
                    fields: [defineField({name: 'alt', type: 'string', title: 'Testo alternativo'})],
                }),
                defineField({
                    name: 'traduzioni',
                    title: 'Testi',
                    type: 'array',
                    of: [defineArrayMember({
                        type: 'object',
                        fields: [
                            defineField({name: 'language', title: 'Lingua', type: 'string', options: {list: [{title: 'Italiano', value: 'it'}, {title: 'English', value: 'en'}, {title: 'Español', value: 'es'}]}, validation: (rule) => rule.required()}),
                            defineField({name: 'didascalia', title: 'Didascalia immagine', type: 'string', initialValue: '“Thàvma” (autoritratto), dal libro Rivelazioni di Denise Alesi'}),
                            defineField({name: 'titolo', title: 'Titolo', type: 'string', initialValue: 'Castelli di carta'}),
                            defineField({name: 'sottotitolo', title: 'Sottotitolo', type: 'string', initialValue: 'Dialogo XIV'}),
                            defineField({name: 'testo', title: 'Testo', type: 'array', of: [defineArrayMember({type: 'block'})], validation: (rule) => rule.required().min(1)}),
                        ],
                        preview: {select: {title: 'titolo', subtitle: 'language'}},
                    })],
                    validation: (rule) => rule.custom((translations) => {
                        const languages = (translations || []).map((translation) => (translation as {language?: string}).language).filter(Boolean)
                        return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
                    }),
                }),
            ],
        }),
    ],
    preview: {
        select: {
            image: 'ritratto',
            language: 'traduzioni.0.language',
        },
        prepare({image, language}) {
            return {
                title: 'Header Homepage',
                subtitle: language ? `Apertura editoriale · ${language}` : 'Apertura editoriale',
                media: image,
            }
        },
    },
})
