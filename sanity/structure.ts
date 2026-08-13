import type {StructureResolver} from 'sanity/structure'

const singletonTypes = new Set(['about', 'header'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      S.listItem()
        .id('about')
        .title('Biografia')
        .child(S.document().schemaType('about').documentId('about').title('Biografia')),
      S.listItem()
        .id('header')
        .title('Header Homepage')
        .child(S.document().schemaType('header').documentId('header').title('Header Homepage')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ''),
      ),
    ])
