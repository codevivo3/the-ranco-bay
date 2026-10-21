import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'

export const heroScene = defineType({
  name: 'heroScene',
  title: "Scena dell'apertura",
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Sopratitolo', type: 'localeStringRecommended'}),
    defineField({name: 'heading', title: 'Titolo', type: 'localeStringRecommended'}),
    defineField({name: 'image', title: 'Fotografia', type: 'editorialImage'}),
  ],
})

export const cinematicHero = defineType({
  name: 'cinematicHero',
  title: 'Apertura cinematografica',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'headline',
      title: "Titolo principale dell'apertura",
      description: 'Titolo principale nelle quattro lingue. Campo obbligatorio.',
      type: 'localeStringRequired',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metadata',
      title: "Riga informativa dell'apertura",
      description: 'Breve indicazione di luogo o contesto mostrata con il titolo.',
      type: 'localeStringRecommended',
    }),
    defineField({name: 'promise', title: 'Scena introduttiva', type: 'heroScene'}),
    defineField({name: 'inside', title: 'Scena degli interni', type: 'heroScene'}),
    defineField({name: 'outside', title: 'Scena degli esterni', type: 'heroScene'}),
    defineField({
      name: 'privateBeach',
      title: 'Scena della spiaggia privata',
      type: 'heroScene',
    }),
    defineField({name: 'reveal', title: 'Scena finale', type: 'heroScene'}),
  ],
})
