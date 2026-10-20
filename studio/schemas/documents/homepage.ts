import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

const editorialSectionFields = [
  ['accommodationOverview', 'Accommodation overview'],
  ['apartmentsOverview', 'Apartments overview'],
  ['localGuideOverview', 'Local Guide overview'],
  ['hospitality', 'Hospitality'],
  ['finalCallToAction', 'Final call to action'],
] as const

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'photography', title: 'Photography'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Cinematic hero',
      type: 'cinematicHero',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    ...editorialSectionFields.map(([name, title]) =>
      defineField({name, title, type: 'editorialSection', group: 'content'}),
    ),
    defineField({
      name: 'featuredPhotography',
      title: 'Featured photography',
      description: 'Drag images to set their editorial order.',
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
      group: 'photography',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
