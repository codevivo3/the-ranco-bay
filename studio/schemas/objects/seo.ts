import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Search title',
      type: 'localeStringRecommended',
      description: 'Aim for a concise title. Missing translations are warnings.',
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      type: 'localeTextRecommended',
      description: 'A short summary for search and social previews.',
    }),
    defineField({
      name: 'socialImage',
      title: 'Social sharing image',
      type: 'editorialImage',
    }),
  ],
})
