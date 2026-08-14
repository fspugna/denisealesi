import { defineConfig } from 'sanity'
import {itITLocale} from '@sanity/locale-it-it'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
    name: 'default',
    title: 'Denise Alesi',
    projectId: 'f7yyl8n6',
    dataset: 'production',
    plugins: [structureTool({structure}), itITLocale()],
    document: {
        comments: {
            enabled: false,
        },
        newDocumentOptions: (previous) => previous.filter(
            (item) => !['about', 'header', 'contatti'].includes(item.templateId),
        ),
        actions: (previous, context) => ['about', 'header', 'contatti'].includes(context.schemaType)
            ? previous.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
            : previous,
    },
    schema: {
        types: schemaTypes,
    },
})
