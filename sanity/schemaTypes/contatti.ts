import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const contatti = defineType({
  name: 'contatti',
  title: 'Contatti',
  type: 'document',
  icon: EnvelopeIcon,
  initialValue: {
    email: 'denise.alesi@alice.it',
    social: [
      {_key: 'facebook', _type: 'socialItem', nome: 'Facebook', url: 'https://www.facebook.com/denise.alesi.583'},
      {_key: 'instagram', _type: 'socialItem', nome: 'Instagram', url: 'https://www.instagram.com/denise_alesi'},
      {_key: 'youtube', _type: 'socialItem', nome: 'YouTube', url: 'https://www.youtube.com/channel/UCMWKycyJwLHJlgrPcHMn6zw/featured'},
    ],
  },
  fields: [
    defineField({
      name: 'email',
      title: 'Indirizzo email',
      type: 'string',
      validation: (rule) => rule.email().required(),
    }),
    defineField({
      name: 'telefono',
      title: 'Numero di telefono',
      type: 'string',
      description: 'Nel sito precedente il numero non era indicato. Compila il campo solo se deve essere pubblico.',
    }),
    defineField({
      name: 'foto',
      title: 'Foto contatti',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Testo alternativo', type: 'string'})],
    }),
    defineField({
      name: 'social',
      title: 'Profili social',
      type: 'array',
      validation: (rule) => rule.unique(),
      of: [defineArrayMember({
        type: 'object',
        name: 'socialItem',
        fields: [
          defineField({name: 'nome', type: 'string', title: 'Nome', validation: (rule) => rule.required()}),
          defineField({
            name: 'url',
            type: 'url',
            title: 'URL profilo',
            validation: (rule) => rule.uri({scheme: ['http', 'https']}).required(),
          }),
        ],
        preview: {select: {title: 'nome', subtitle: 'url'}},
      })],
    }),
  ],
  preview: {prepare: () => ({title: 'Contatti'})},
})
