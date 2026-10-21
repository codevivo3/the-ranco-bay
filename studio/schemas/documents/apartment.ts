import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

import {apartmentDocuments} from '../../lib/constants'

export const apartment = defineType({
  name: 'apartment',
  title: 'Appartamento',
  type: 'document',
  icon: HomeIcon,
  description:
    "L'identità e il nome pubblico dell'appartamento sono definiti dalla struttura dello Studio.",
  groups: [
    {name: 'content', title: 'Contenuti', default: true},
    {name: 'photography', title: 'Fotografie'},
    {name: 'amenities', title: 'Servizi'},
    {name: 'seo', title: 'SEO e motori di ricerca'},
  ],
  fields: [
    defineField({
      name: 'introduction',
      title: 'Introduzione',
      description: 'Le quattro traduzioni sono obbligatorie prima della pubblicazione.',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'essentialInformation',
      title: "Informazioni essenziali sull'appartamento",
      description: 'Le quattro traduzioni sono obbligatorie prima della pubblicazione.',
      type: 'localeRichTextRequired',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorialDetails',
      title: 'Approfondimenti editoriali',
      description:
        "Informazioni aggiuntive sull'appartamento. Le traduzioni mancanti producono un avviso ma non bloccano la pubblicazione.",
      type: 'localeRichTextRecommended',
      group: 'content',
    }),
    defineField({
      name: 'photography',
      title: 'Fotografie',
      type: 'apartmentPhotography',
      group: 'photography',
    }),
    defineField({
      name: 'amenities',
      title: 'Servizi descritti sul sito',
      description:
        'Aggiungi solo servizi confermati per questo appartamento. Ogni voce deve essere tradotta nelle quattro lingue.',
      type: 'array',
      of: [{type: 'amenity'}],
      group: 'amenities',
    }),
    defineField({
      name: 'seo',
      title: 'SEO e motori di ricerca',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {id: '_id'},
    prepare: ({id}) => {
      const documentId = String(id).replace(/^drafts\./, '')
      const apartmentDefinition = apartmentDocuments.find(
        (apartment) => apartment.id === documentId,
      )
      return {
        title: apartmentDefinition?.title ?? 'Appartamento protetto',
        subtitle: apartmentDefinition?.id ?? documentId,
      }
    },
  },
})
