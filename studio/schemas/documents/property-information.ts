import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineField, defineType} from 'sanity'

import {createSeoFields} from '../objects/seo'

export const propertyInformation = defineType({
  name: 'propertyInformation',
  title: 'Informazioni sulla proprietà',
  type: 'document',
  icon: EarthGlobeIcon,
  description:
    'ATTENZIONE: questi contenuti saranno pubblici. Non inserire password, codici di accesso, posizioni delle cassette portachiavi, istruzioni riservate, dati personali degli ospiti o altre informazioni sensibili.',
  groups: [
    {name: 'content', title: 'Contenuti', default: true},
    {name: 'photography', title: 'Fotografie'},
    {name: 'seo', title: 'SEO e motori di ricerca'},
  ],
  fields: [
    defineField({
      name: 'overview',
      title: 'La proprietà e gli spazi comuni',
      description:
        "Descrivi la proprietà, l'atmosfera, gli spazi esterni condivisi e la spiaggia privata. Inserisci solo informazioni valide per l'intera proprietà.",
      type: 'editorialSection',
      group: 'content',
    }),
    defineField({
      name: 'arrivalAndParking',
      title: 'Arrivo e parcheggio',
      description:
        'Inserisci indicazioni generali per raggiungere la struttura e informazioni pubbliche sul parcheggio e sui trasporti. Non inserire codici o istruzioni di accesso riservate.',
      type: 'editorialSection',
      group: 'content',
    }),
    defineField({
      name: 'stayEssentials',
      title: 'Informazioni per il soggiorno',
      description:
        "Indica le regole generali della casa, gli orari pubblici di check-in e check-out, i servizi condivisi e le informazioni pratiche valide per tutta la proprietà.",
      type: 'editorialSection',
      group: 'content',
    }),
    defineField({
      name: 'assistance',
      title: 'Assistenza e contatti utili',
      description:
        'Spiega come gli ospiti possono richiedere assistenza e rimandali alle pagine Contatti e Guida locale. Non duplicare numeri di telefono o indirizzi email già gestiti dal sito.',
      type: 'editorialSection',
      group: 'content',
    }),
    defineField({
      name: 'exteriorPhotography',
      title: 'Fotografie della proprietà',
      description:
        'Aggiungi fotografie generali della proprietà, degli spazi esterni condivisi e della spiaggia privata. Le fotografie degli interni appartengono alle schede dei singoli appartamenti.',
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
      group: 'photography',
    }),
    defineField({
      name: 'seo',
      title: 'SEO e motori di ricerca',
      type: 'object',
      fields: createSeoFields({
        title: {
          title: 'Titolo SEO',
          description:
            'Titolo visualizzato nei risultati dei motori di ricerca. Scrivi un titolo chiaro e conciso.',
        },
        description: {
          title: 'Descrizione SEO',
          description:
            'Breve descrizione della pagina utilizzata nei risultati di ricerca e nelle anteprime dei collegamenti.',
        },
        socialImage: {
          title: 'Immagine per la condivisione',
          description:
            'Immagine utilizzata nelle anteprime quando la pagina viene condivisa.',
        },
      }),
      group: 'seo',
    }),
  ],
  preview: {prepare: () => ({title: 'La proprietà'})},
})
