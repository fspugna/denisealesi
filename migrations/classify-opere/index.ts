import {at, defineMigration, setIfMissing} from 'sanity/migrate'

const categoriesByDocumentId: Record<string, 'letteraria' | 'visiva'> = {
  '7f38c48e-0947-4f73-bd86-706d29e580d6': 'letteraria',
  'fcaaeef9-6fab-4d57-b8c6-e61add80c9dd': 'letteraria',
  '437849c7-5db3-4965-924f-8f055099232d': 'letteraria',
  'c6ecf279-b1bd-4c48-823a-05c06b794914': 'letteraria',
  '0016fb38-ee98-4cb1-86e7-b671ce393397': 'letteraria',
  'df4a7eeb-5704-4e1f-b949-2837fd28b6d5': 'visiva',
  '8ed62a33-71e0-4aeb-8afc-151ac1f42b87': 'visiva',
  '94333828-3573-4692-89cc-7bba63751418': 'visiva',
  'fd472177-c57a-4d29-8a29-a0bf706ea909': 'visiva',
}

export default defineMigration({
  title: 'Classifica le opere nei percorsi letterario e visivo',
  documentTypes: ['opera'],
  migrate: {
    document(document) {
      const publishedId = document._id.replace(/^drafts\./, '')
      const categoria = categoriesByDocumentId[publishedId]

      if (!categoria) return

      return at('categoria', setIfMissing(categoria))
    },
  },
})
