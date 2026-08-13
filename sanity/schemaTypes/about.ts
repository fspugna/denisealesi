import {defineArrayMember, defineField, defineType} from 'sanity'

export const about = defineType({
    name: 'about',
    title: 'Biografia',
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
                                {title: 'Italiano', value: 'it'},
                                {title: 'English', value: 'en'},
                                {title: 'Español', value: 'es'},
                            ],
                        },
                        validation: (rule) => rule.required(),
                    }),
                    defineField({name: 'titolo', title: 'Titolo', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'biografia', title: 'Biografia', type: 'array', of: [defineArrayMember({type: 'block'})], validation: (rule) => rule.required()}),
                ]
            })],
            validation: (rule) => rule.required().min(1).custom((translations) => {
                const languages = (translations || [])
                    .map((translation) => (translation as {language?: string}).language)
                    .filter(Boolean)
                return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
            }),
        }),
        defineField({
            name: 'foto',
            title: 'Foto biografia',
            type: 'image',
            options: {hotspot: true},
            description: 'Usa lo strumento hotspot per indicare il volto o il punto che non deve essere tagliato.',
        }),
        defineField({ name: 'sfondo', title: 'Sfondo biografia', type: 'image' }),
    ],
    preview: {
        select: {title: 'traduzioni.0.titolo'},
        prepare: ({title}) => ({title: title || 'Biografia'}),
    },
})
