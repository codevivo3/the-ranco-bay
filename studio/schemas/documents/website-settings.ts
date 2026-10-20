import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const websiteSettings = defineType({
  name: 'websiteSettings',
  title: 'Website Settings',
  type: 'document',
  icon: CogIcon,
  description:
    'Public editorial defaults only. Secrets, booking rules, and integrations do not belong here.',
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'seo', title: 'SEO defaults'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Public site name',
      type: 'string',
      initialValue: 'The Ranco Bay',
      validation: (Rule) => Rule.required(),
      readOnly: true,
      group: 'editorial',
    }),
    defineField({
      name: 'footerStatement',
      title: 'Footer statement',
      type: 'localeStringRecommended',
      group: 'editorial',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Website Settings'})},
})
