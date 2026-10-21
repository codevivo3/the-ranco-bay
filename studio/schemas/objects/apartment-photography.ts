import {ImagesIcon} from '@sanity/icons/Images'
import {defineField, defineType} from 'sanity'

export const photographyCategories = [
  ['bathroom', 'Bagno'],
  ['bedroom', 'Camera da letto'],
  ['details', 'Dettagli'],
  ['kitchen', 'Cucina'],
  ['living', 'Zona giorno'],
  ['general', 'Generali'],
] as const

export const apartmentPhotography = defineType({
  name: 'apartmentPhotography',
  title: "Fotografie dell'appartamento",
  type: 'object',
  icon: ImagesIcon,
  description:
    'Carica, sostituisci e riordina le fotografie in ogni categoria trascinandole. Scegli immagini rappresentative e prive di informazioni sensibili.',
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
