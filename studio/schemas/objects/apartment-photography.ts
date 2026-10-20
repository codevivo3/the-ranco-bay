import {ImagesIcon} from '@sanity/icons/Images'
import {defineField, defineType} from 'sanity'

export const photographyCategories = [
  ['bathroom', 'Bathroom'],
  ['bedroom', 'Bedroom'],
  ['details', 'Details'],
  ['kitchen', 'Kitchen'],
  ['living', 'Living'],
  ['general', 'General'],
] as const

export const apartmentPhotography = defineType({
  name: 'apartmentPhotography',
  title: 'Apartment photography',
  type: 'object',
  icon: ImagesIcon,
  description:
    'Upload, replace, preview, and drag to reorder images within each category.',
  fields: photographyCategories.map(([name, title]) =>
    defineField({
      name,
      title,
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
    }),
  ),
})
