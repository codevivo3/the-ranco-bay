import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {defineField, defineType} from 'sanity'

export const amenity = defineType({
  name: 'amenity',
  title: 'Amenity',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Amenity name',
      type: 'localeStringRequired',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Optional details',
      type: 'localeTextRecommended',
    }),
  ],
  preview: {
    select: {title: 'label.en'},
    prepare: ({title}) => ({title: title || 'Untitled amenity'}),
  },
})
