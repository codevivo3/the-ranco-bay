import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

import {apartmentDocuments} from '../../lib/constants'

export const apartment = defineType({
  name: 'apartment',
  title: 'Apartment',
  type: 'document',
  icon: HomeIcon,
  description:
    'The apartment identity and display name are fixed by the Studio structure.',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'photography', title: 'Photography'},
    {name: 'amenities', title: 'Amenities'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'introduction',
      title: 'Introduction',
      description: 'All four translations are required before publication.',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'essentialInformation',
      title: 'Essential apartment information',
      description: 'All four translations are required before publication.',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorialDetails',
      title: 'Secondary editorial details',
      type: 'localeRichTextRecommended',
      group: 'content',
    }),
    defineField({
      name: 'photography',
      title: 'Photography',
      type: 'apartmentPhotography',
      group: 'photography',
    }),
    defineField({
      name: 'amenities',
      title: 'Editorial amenities',
      type: 'array',
      of: [{type: 'amenity'}],
      group: 'amenities',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {id: '_id'},
    prepare: ({id}) => {
      const documentId = String(id).replace(/^drafts\./, '')
      const apartmentDefinition = apartmentDocuments.find(
        (apartment) => apartment.id === documentId,
      )
      return {
        title: apartmentDefinition?.title ?? 'Protected apartment',
        subtitle: apartmentDefinition?.id ?? documentId,
      }
    },
  },
})
