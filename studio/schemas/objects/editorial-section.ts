import {BlockElementIcon} from '@sanity/icons/BlockElement'
import {defineField, defineType} from 'sanity'

export const editorialSection = defineType({
  name: 'editorialSection',
  title: 'Editorial section',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'localeStringRecommended',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeStringRecommended',
    }),
    defineField({name: 'body', title: 'Body', type: 'localeRichTextRecommended'}),
    defineField({name: 'image', title: 'Photography', type: 'editorialImage'}),
    defineField({
      name: 'linkLabel',
      title: 'Link label',
      type: 'localeStringRecommended',
    }),
  ],
})
