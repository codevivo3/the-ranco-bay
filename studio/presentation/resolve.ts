import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

import {withoutDraftPrefix} from '../lib/constants'
import {supportedLanguages} from '../lib/locales'

const localeLocations = (path: string, title: string) =>
  supportedLanguages.map(({id, title: language}) => ({
    title: `${title} · ${language}`,
    href: `/${id}${path}`,
  }))

export const presentationResolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homepage: defineLocations({
      locations: localeLocations('', 'Pagina iniziale'),
    }),
    apartment: defineLocations({
      select: {documentId: '_id'},
      resolve: (document) => {
        const id = withoutDraftPrefix(String(document?.documentId ?? ''))

        if (id === 'ground-floor') {
          return {locations: localeLocations('/house', 'Veranda')}
        }

        if (id === 'upper-floor') {
          return {
            locations: localeLocations('/apartments/upper-floor', 'Mansarda'),
          }
        }

        return {
          message: 'Questo appartamento non dispone di una pagina pubblica di anteprima.',
        }
      },
    }),
    propertyInformation: defineLocations({
      locations: localeLocations('/property', 'La proprietà'),
    }),
    localGuideEntry: defineLocations({
      locations: localeLocations('/guide', 'Guida locale'),
    }),
  },
}
