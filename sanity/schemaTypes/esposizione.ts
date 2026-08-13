import { defineField, defineType } from 'sanity'

export const esposizione = defineType({
    name: 'esposizione',
    title: 'Esposizioni',
    type: 'document',
    fields: [
        defineField({
            name: 'traduzioni',
            title: 'Traduzioni',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'language',
                        title: 'Lingua',
                        type: 'string',
                        options: {
                            list: [
                                { title: 'Italiano', value: 'it' },
                                { title: 'English', value: 'en' },
                                { title: 'Español', value: 'es' }
                            ],
                        }
                    },
                    { name: 'titolo', type: 'string', title: 'Titolo' },
                    { name: 'contenuto', title: 'Contenuto', type: 'array', of: [{
                        type: 'block',
                        marks: { annotations: [{
                            name: 'link',
                            type: 'object',
                            fields: [{
                                name: 'href',
                                type: 'url',
                                validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                            }],
                        }] }
                    }] }
                ]
            }]
        }),
        defineField({ name: 'data', type: 'date' }),
        defineField({
            name: 'immagini',
            title: 'Immagini',
            type: 'array',
            of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }]
            }]
        }),
    ],
    preview: {
        select: {
            title: 'traduzioni.0.titolo',
            subtitle: 'data'
        }
    }
})
