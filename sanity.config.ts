import { defineConfig } from 'sanity'
import {itITLocale} from '@sanity/locale-it-it'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
    name: 'default',
    title: 'Sandro Frinolli Portfolio',
    projectId: 'vci8k9tk',
    dataset: 'production',
    plugins: [structureTool({structure}), itITLocale()],
    document: {
        comments: {
            enabled: false,
        },
        newDocumentOptions: (previous) => previous.filter(
            (item) => !['about', 'header'].includes(item.templateId),
        ),
        actions: (previous, context) => ['about', 'header'].includes(context.schemaType)
            ? previous.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
            : previous,
    },
    schema: {
        types: schemaTypes,
    },
})
