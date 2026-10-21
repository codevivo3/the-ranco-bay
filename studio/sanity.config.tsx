import {languageFilter} from '@sanity/language-filter'
import {defineConfig, defineSingleton} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {TrbLogo} from './components/trb-logo'
import {apartmentDocuments, protectedDocumentIds, withoutDraftPrefix} from './lib/constants'
import {dataset, previewOrigin, projectId} from './lib/environment'
import {supportedLanguages} from './lib/locales'
import {presentationResolve} from './presentation/resolve'
import {schemaTypes} from './schemas'
import {structure} from './structure'
import {trbTheme} from './theme'
import './studio.css'

const singletons = [
  'homepage',
  ...apartmentDocuments.map(({id, title}) =>
    defineSingleton({documentId: id, schemaType: 'apartment', title}),
  ),
  'propertyInformation',
  'websiteSettings',
]

export default defineConfig({
  name: 'the-ranco-bay',
  title: 'THE RANCO BAY',
  icon: TrbLogo,
  projectId,
  dataset,
  theme: trbTheme,
  plugins: [
    structureTool({name: 'content', title: 'Contenuti', structure}),
    presentationTool({
      name: 'preview',
      title: 'Anteprima',
      resolve: presentationResolve,
      allowOrigins: [previewOrigin],
      previewUrl: {
        initial: `${previewOrigin}/en`,
        previewMode: {
          enable: '/api/draft-mode/enable',
          shareAccess: false,
        },
      },
    }),
    languageFilter({
      supportedLanguages: [...supportedLanguages],
      defaultLanguages: ['en'],
      documentTypes: [
        'homepage',
        'apartment',
        'propertyInformation',
        'localGuideEntry',
        'websiteSettings',
      ],
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({schemaType}) =>
          !['homepage', 'apartment', 'propertyInformation', 'websiteSettings'].includes(
            schemaType,
          ),
      ),
  },
  document: {
    singletons,
    actions: (actions, context) => {
      if (
        !context.documentId ||
        !protectedDocumentIds.has(withoutDraftPrefix(context.documentId))
      ) {
        return actions
      }

      return actions.filter((action) => {
        const actionName = (action as {action?: string}).action
        return !['delete', 'duplicate', 'unpublish'].includes(actionName ?? '')
      })
    },
  },
})
