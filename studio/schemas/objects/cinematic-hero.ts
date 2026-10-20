import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'

export const heroScene = defineType({
  name: 'heroScene',
  title: 'Hero scene',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeStringRecommended'}),
    defineField({name: 'heading', title: 'Heading', type: 'localeStringRecommended'}),
    defineField({name: 'image', title: 'Photography', type: 'editorialImage'}),
  ],
})

export const cinematicHero = defineType({
  name: 'cinematicHero',
  title: 'Cinematic hero',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Hero headline',
      type: 'localeStringRequired',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metadata',
      title: 'Hero metadata line',
      type: 'localeStringRecommended',
    }),
    defineField({name: 'promise', title: 'Promise scene', type: 'heroScene'}),
    defineField({name: 'inside', title: 'Inside scene', type: 'heroScene'}),
    defineField({name: 'outside', title: 'Outside scene', type: 'heroScene'}),
    defineField({
      name: 'privateBeach',
      title: 'Private beach scene',
      type: 'heroScene',
    }),
    defineField({name: 'reveal', title: 'Reveal scene', type: 'heroScene'}),
  ],
})
