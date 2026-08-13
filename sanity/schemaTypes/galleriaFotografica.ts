import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleriaFotografica = defineType({
  name: 'galleriaFotografica',
  title: 'Gallerie fotografiche',
  type: 'document',
  fields: [
    defineField({
      name: 'data',
      title: 'Data',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'traduzioni',
      title: 'Titolo e descrizione',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'language', title: 'Lingua', type: 'string', options: {list: [{title: 'Italiano', value: 'it'}, {title: 'English', value: 'en'}, {title: 'Español', value: 'es'}]}, validation: (rule) => rule.required()}),
          defineField({name: 'titolo', title: 'Titolo', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'descrizione', title: 'Descrizione', type: 'text', rows: 4}),
        ],
        preview: {select: {title: 'titolo', subtitle: 'language'}},
      })],
      validation: (rule) => rule.required().min(1).custom((translations) => {
        const languages = (translations || []).map((item) => (item as {language?: string}).language).filter(Boolean)
        return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
      }),
    }),
    defineField({
      name: 'fotografie',
      title: 'Fotografie',
      type: 'array',
      options: {layout: 'grid'},
      of: [defineArrayMember({
        type: 'image',
        options: {hotspot: true},
        fields: [
          defineField({name: 'alt', title: 'Testo alternativo', type: 'string'}),
          defineField({name: 'didascalia', title: 'Didascalia', type: 'string'}),
        ],
      })],
      validation: (rule) => rule.required().min(1).error('Carica almeno una fotografia.'),
    }),
  ],
  preview: {
    select: {title: 'traduzioni.0.titolo', subtitle: 'data', media: 'fotografie.0'},
    prepare: ({title, subtitle, media}) => ({title: title || 'Galleria senza titolo', subtitle, media}),
  },
})
