import {defineArrayMember, defineField} from 'sanity'

export const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Testo normale', value: 'normal'},
    {title: 'Titolo', value: 'h2'},
    {title: 'Sottotitolo', value: 'h3'},
    {title: 'Citazione', value: 'blockquote'},
  ],
  lists: [
    {title: 'Elenco puntato', value: 'bullet'},
    {title: 'Elenco numerato', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Grassetto', value: 'strong'},
      {title: 'Corsivo', value: 'em'},
      {title: 'Sottolineato', value: 'underline'},
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'Indirizzo',
            type: 'url',
            validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}).required(),
          }),
        ],
      }),
    ],
  },
})
