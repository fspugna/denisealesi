import { defineField, defineType } from 'sanity'

export const contatti = defineType({
    name: 'contatti',
    title: 'Contatti',
    type: 'document',
    fields: [
        defineField({
            name: 'telefono',
            title: 'Numero di Telefono',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Indirizzo Email',
            type: 'string',
        }),
        defineField({
            name: 'foto',
            title: 'Foto Ritratto',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'social',
            title: 'Social Network',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'socialItem',
                    fields: [
                        { name: 'nome', type: 'string', title: 'Nome Social', validation: Rule => Rule.required() },
                        { name: 'url', type: 'url', title: 'URL Profilo', validation: Rule => Rule.required() },
                    ],
                },
            ],
        }),
    ],
})