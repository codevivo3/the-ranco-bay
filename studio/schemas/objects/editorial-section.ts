import {BlockElementIcon} from '@sanity/icons/BlockElement'
import {defineField, defineType} from 'sanity'

export const editorialSection = defineType({
  name: 'editorialSection',
  title: 'Sezione editoriale',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Sopratitolo',
      description: 'Breve etichetta mostrata sopra il titolo. Campo facoltativo.',
      type: 'localeStringRecommended',
    }),
    defineField({
      name: 'heading',
      title: 'Titolo',
      description: 'Titolo principale della sezione nelle lingue disponibili.',
      type: 'localeStringRecommended',
    }),
    defineField({
      name: 'body',
      title: 'Testo',
      description: 'Contenuto editoriale della sezione nelle lingue disponibili.',
      type: 'localeRichTextRecommended',
    }),
    defineField({name: 'image', title: 'Fotografia', type: 'editorialImage'}),
    defineField({
      name: 'linkLabel',
      title: 'Testo del collegamento',
      description: 'Testo breve del collegamento mostrato alla fine della sezione.',
      type: 'localeStringRecommended',
      hidden: ({document}) => document?._type === 'propertyInformation',
    }),
  ],
})
