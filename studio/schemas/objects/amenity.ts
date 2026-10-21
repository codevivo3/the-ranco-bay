import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {defineField, defineType} from 'sanity'

export const amenity = defineType({
  name: 'amenity',
  title: 'Servizio',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Nome del servizio',
      description: 'Nome pubblico del servizio nelle quattro lingue.',
      type: 'localeStringRequired',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Dettagli facoltativi',
      description:
        'Aggiungi una breve precisazione solo quando è utile agli ospiti.',
      type: 'localeTextRecommended',
    }),
  ],
  preview: {
    select: {title: 'label.en'},
    prepare: ({title}) => ({title: title || 'Servizio senza titolo'}),
  },
})
