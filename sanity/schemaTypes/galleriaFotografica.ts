import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {richTextBlock} from './shared/richText'
import {contentSlugField} from './shared/contentSlug'

export const galleriaFotografica = defineType({
  name: 'galleriaFotografica',
  title: 'Gallerie fotografiche',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'galleriaFotografica'}),
    contentSlugField,
    defineField({
      name: 'data',
      title: 'Data',
      type: 'date',
      description: 'Facoltativa: compilala solo quando la data della galleria è nota.',
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
          defineField({
            name: 'titoloDescrizione',
            title: 'Titolo della descrizione',
            type: 'string',
            description: 'Facoltativo. Viene mostrato sopra il testo descrittivo come titolo di sezione.',
          }),
          defineField({
            name: 'descrizioneRichText',
            title: 'Descrizione',
            type: 'array',
            description: 'Puoi incollare testo e usare titoli, elenchi, grassetto, corsivo, sottolineato e link.',
            of: [richTextBlock],
          }),
          defineField({
            name: 'descrizione',
            title: 'Descrizione precedente',
            type: 'text',
            deprecated: {reason: 'Il contenuto è stato trasferito nella descrizione formattata.'},
            readOnly: true,
            hidden: true,
          }),
        ],
        preview: {select: {title: 'titolo', subtitle: 'language'}},
      })],
      validation: (rule) => rule.required().min(1).custom((translations) => {
        const languages = (translations || []).map((item) => (item as {language?: string}).language).filter(Boolean)
        return new Set(languages).size === languages.length || 'Ogni lingua può essere inserita una sola volta.'
      }),
    }),
    defineField({
      name: 'copertina',
      title: 'Foto di copertina',
      type: 'image',
      description: 'Facoltativa. Scegli l’immagine usata nelle anteprime della galleria. Se non la imposti, verrà usata la prima fotografia della galleria.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Testo alternativo', type: 'string'}),
      ],
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
    defineField({
      name: 'legacyId',
      title: 'ID sito precedente',
      type: 'string',
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'legacyUrl',
      title: 'URL sito precedente',
      type: 'url',
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'migratedAt',
      title: 'Data migrazione',
      type: 'datetime',
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
  ],
  preview: {
    select: {title: 'traduzioni.0.titolo', subtitle: 'data', cover: 'copertina', firstPhoto: 'fotografie.0'},
    prepare: ({title, subtitle, cover, firstPhoto}) => ({title: title || 'Galleria senza titolo', subtitle, media: cover || firstPhoto}),
  },
})
