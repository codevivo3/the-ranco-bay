import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'

type SeoFieldCopy = {
  description: {description: string; title: string}
  socialImage: {description?: string; title: string}
  title: {description: string; title: string}
}

const defaultCopy: SeoFieldCopy = {
  title: {
    title: 'Titolo SEO',
    description:
      'Titolo visualizzato nei risultati dei motori di ricerca. Scrivi un titolo chiaro e conciso in ogni lingua.',
  },
  description: {
    title: 'Descrizione SEO',
    description:
      'Breve descrizione utilizzata nei risultati di ricerca e nelle anteprime dei collegamenti.',
  },
  socialImage: {
    title: 'Immagine per la condivisione',
    description:
      'Immagine utilizzata nelle anteprime quando la pagina viene condivisa.',
  },
}

export function createSeoFields(copy: SeoFieldCopy = defaultCopy) {
  return [
    defineField({
      name: 'title',
      title: copy.title.title,
      type: 'localeStringRecommended',
      description: copy.title.description,
    }),
    defineField({
      name: 'description',
      title: copy.description.title,
      type: 'localeTextRecommended',
      description: copy.description.description,
    }),
    defineField({
      name: 'socialImage',
      title: copy.socialImage.title,
      type: 'editorialImage',
      description: copy.socialImage.description,
    }),
  ]
}

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: createSeoFields(),
})
