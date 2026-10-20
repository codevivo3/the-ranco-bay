import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineField, defineType} from 'sanity'

export const propertyInformation = defineType({
  name: 'propertyInformation',
  title: 'Property Information',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'photography', title: 'Photography'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'description',
      title: 'Shared editorial description',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'practicalGuestInformation',
      title: 'Practical guest information',
      description: 'Editorial guest guidance only; no booking configuration.',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'exteriorPhotography',
      title: 'Exterior photography',
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
      group: 'photography',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'The Property'})},
})
