import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const websiteSettings = defineType({
  name: 'websiteSettings',
  title: 'Impostazioni del sito',
  type: 'document',
  icon: CogIcon,
  description:
    'Inserisci solo impostazioni editoriali pubbliche. Non aggiungere credenziali, regole di prenotazione, dati degli ospiti o informazioni riservate sulle integrazioni.',
  groups: [
    {name: 'editorial', title: 'Contenuti editoriali', default: true},
    {name: 'seo', title: 'SEO predefinita'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nome pubblico del sito',
      description: 'Nome ufficiale mostrato sul sito. Questo campo non è modificabile.',
      type: 'string',
      initialValue: 'The Ranco Bay',
      validation: (Rule) => Rule.required(),
      readOnly: true,
      group: 'editorial',
    }),
    defineField({
      name: 'footerStatement',
      title: 'Testo del piè di pagina',
      description:
        'Breve testo mostrato nel piè di pagina. Inserisci le versioni nelle quattro lingue.',
      type: 'localeStringRecommended',
      group: 'editorial',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO predefinita',
      description:
        'Valori utilizzati quando una pagina non dispone di informazioni SEO specifiche.',
      type: 'seo',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Impostazioni del sito'})},
})
