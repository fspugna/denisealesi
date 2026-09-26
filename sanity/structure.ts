import {BookIcon, ImageIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

const singletonTypes = new Set(['about', 'header', 'contatti'])

export const structure: StructureResolver = (S, context) =>
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
      S.listItem()
        .id('contatti')
        .title('Contatti')
        .child(S.document().schemaType('contatti').documentId('contatti').title('Contatti')),
      S.divider(),
      S.listItem()
        .id('opere-letterarie')
        .title('Opere letterarie')
        .icon(BookIcon)
        .child(
          S.documentTypeList('opera')
            .title('Opere letterarie')
            .filter('_type == "opera" && categoria == "letteraria"'),
        ),
      S.listItem()
        .id('opere-visive')
        .title('Opere visive')
        .icon(ImageIcon)
        .child(
          S.documentTypeList('opera')
            .title('Opere visive')
            .filter('_type == "opera" && categoria == "visiva"'),
        ),
      orderableDocumentListDeskItem({
        type: 'galleriaFotografica',
        title: 'Gallerie fotografiche',
        icon: ImageIcon,
        S,
        context,
      }),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? '') && !['opera', 'galleriaFotografica'].includes(item.getId() ?? ''),
      ),
    ])
