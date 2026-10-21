import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'

type SeoFieldCopy = {
  description: {description: string; title: string}
  socialImage: {description?: string; title: string}
  title: {description: string; title: string}
}

const defaultCopy: SeoFieldCopy = {
  title: {
    title: 'Search title',
    description: 'Aim for a concise title. Missing translations are warnings.',
  },
  description: {
    title: 'Search description',
    description: 'A short summary for search and social previews.',
  },
  socialImage: {title: 'Social sharing image'},
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
