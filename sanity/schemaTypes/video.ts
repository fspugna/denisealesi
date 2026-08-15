import {defineArrayMember, defineField, defineType} from 'sanity'

export const video = defineType({
    name: 'video',
    title: 'Video',
    type: 'document',
    fields: [
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
                        },
                        validation: (rule) => rule.required(),
                    }),
                    defineField({name: 'titolo', type: 'string', title: 'Titolo', validation: (rule) => rule.required()})
                ]
            })],
            validation: (rule) => rule.required().min(1),
        }),
        defineField({name: 'data', type: 'date', validation: (rule) => rule.required()}),
        defineField({
            name: 'url',
            title: 'URL video',
            type: 'url',
            description: 'Link YouTube, Facebook o alla pagina esterna del video.',
            validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
        }),
        defineField({name: 'inEvidenza', title: 'In evidenza', type: 'boolean', initialValue: false}),
        defineField({name: 'legacyId', title: 'ID archivio storico', type: 'number', readOnly: true, hidden: ({value}) => value === undefined}),
        defineField({name: 'legacyUrl', title: 'URL archivio storico', type: 'url', readOnly: true, hidden: ({value}) => value === undefined}),
        defineField({name: 'migratedAt', title: 'Data migrazione', type: 'datetime', readOnly: true, hidden: ({value}) => value === undefined}),
    ],
    preview: {
        select: {
            title: 'traduzioni.0.titolo',
            subtitle: 'data'
        }
    }
})
