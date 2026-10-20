import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const editorialImage = defineType({
  name: 'editorialImage',
  title: 'Fotografia editoriale',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Fotografia',
      description:
        'Carica o seleziona una fotografia. Puoi regolare il punto focale e il ritaglio.',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alternativeText',
      title: 'Testo alternativo',
      description:
        "Descrivi brevemente ciò che si vede nella fotografia. Serve per l'accessibilità del sito. Le traduzioni mancanti producono un avviso ma non bloccano la pubblicazione.",
      type: 'localeStringRecommended',
    }),
  ],
  preview: {
    select: {media: 'image', title: 'alternativeText.en'},
    prepare: ({media, title}) => ({media, title: title || 'Fotografia senza titolo'}),
  },
})
