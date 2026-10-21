import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

const editorialSectionFields = [
  ['accommodationOverview', "Presentazione dell'ospitalità"],
  ['apartmentsOverview', 'Presentazione degli appartamenti'],
  ['localGuideOverview', 'Presentazione della Guida locale'],
  ['hospitality', 'Accoglienza'],
  ['finalCallToAction', 'Invito finale'],
] as const

export const homepage = defineType({
  name: 'homepage',
  title: 'Pagina iniziale',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Contenuti', default: true},
    {name: 'photography', title: 'Fotografie'},
    {name: 'seo', title: 'SEO e motori di ricerca'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Apertura cinematografica',
      type: 'cinematicHero',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    ...editorialSectionFields.map(([name, title]) =>
      defineField({name, title, type: 'editorialSection', group: 'content'}),
    ),
    defineField({
      name: 'featuredPhotography',
      title: 'Fotografie in evidenza',
      description:
        "Trascina le fotografie per definire l'ordine in cui appaiono sul sito.",
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
      group: 'photography',
    }),
    defineField({
      name: 'seo',
      title: 'SEO e motori di ricerca',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {prepare: () => ({title: 'Pagina iniziale'})},
})
