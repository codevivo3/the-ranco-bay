import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'

const categoryTitles: Record<string, string> = {
  eat: 'Mangiare',
  water: "Sull'acqua",
  explore: 'Esplorare',
  practical: 'Informazioni pratiche',
}

export const localGuideEntry = defineType({
  name: 'localGuideEntry',
  title: 'Luogo della Guida locale',
  type: 'document',
  icon: PinIcon,
  groups: [
    {name: 'content', title: 'Contenuti', default: true},
    {name: 'photography', title: 'Fotografie'},
    {name: 'location', title: 'Contatti e informazioni pratiche'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Titolo interno',
      description:
        'Nome utilizzato solo per identificare la scheda nel gestionale. Non appare sul sito. Campo obbligatorio.',
      placeholder: 'es. Battipalo — Lesa',
      type: 'string',
      group: 'content',
      validation: (Rule) =>
        Rule.required().max(120).error('Inserisci un titolo interno.'),
    }),
    defineField({
      name: 'publicTitle',
      title: 'Titolo pubblico',
      description:
        'Nome del luogo mostrato agli ospiti. Esempio: Battipalo. Le quattro traduzioni sono obbligatorie per pubblicare.',
      type: 'localeStringRequired',
      group: 'content',
      validation: (Rule) => Rule.required().error('Inserisci il titolo pubblico.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      description:
        'Racconta cosa rende speciale questo luogo e perché lo consigliamo ai nostri ospiti. È consigliata in tutte le lingue; le traduzioni mancanti producono un avviso ma non bloccano la pubblicazione.',
      type: 'localeRichTextRecommended',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      description: 'Scegli la categoria più adatta al luogo. Campo obbligatorio.',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Mangiare', value: 'eat'},
          {title: "Sull'acqua", value: 'water'},
          {title: 'Esplorare', value: 'explore'},
          {title: 'Informazioni pratiche', value: 'practical'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Scegli una categoria.'),
    }),
    defineField({
      name: 'photography',
      title: 'Fotografie',
      description:
        'Carica fotografie rappresentative del luogo. Puoi riordinarle trascinandole; la prima sarà quella principale. Campo facoltativo.',
      type: 'array',
      of: [{type: 'editorialImage'}],
      options: {layout: 'grid'},
      group: 'photography',
    }),
    defineField({
      name: 'address',
      title: 'Indirizzo',
      description:
        "Indirizzo postale leggibile del ristorante, dell'attrazione o del luogo. Campo facoltativo e non tradotto.",
      placeholder: 'es. Via Vittorio Veneto 9, 28040 Lesa (NO)',
      type: 'text',
      rows: 2,
      group: 'location',
      validation: (Rule) => Rule.max(300).error('Usa al massimo 300 caratteri.'),
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Sito ufficiale',
      description:
        'Inserisci il sito ufficiale del luogo, completo di https://. Campo facoltativo; non usare qui il link di Google Maps.',
      placeholder: 'https://www.esempio.it',
      type: 'url',
      group: 'location',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).error(
          'Inserisci un indirizzo web valido che inizi con http:// o https://.',
        ),
    }),
    defineField({
      name: 'telephone',
      title: 'Telefono',
      description:
        'Numero di telefono del luogo. Puoi usare il formato internazionale, per esempio +39 000 000 0000. Campo facoltativo.',
      placeholder: '+39 000 000 0000',
      type: 'string',
      group: 'location',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          const phone = value.trim()
          const digits = phone.replace(/\D/g, '')
          return /^\+?[0-9][0-9\s()./-]*[0-9]$/.test(phone) &&
            digits.length >= 6 &&
            digits.length <= 20 &&
            phone.length <= 40
            ? true
            : 'Controlla il numero. Usa da 6 a 20 cifre e, se necessario, il prefisso internazionale con +.'
        }),
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps',
      description:
        'Inserisci il link diretto alla posizione o alle indicazioni su Google Maps. Campo facoltativo.',
      placeholder: 'https://maps.app.goo.gl/...',
      type: 'url',
      group: 'location',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).error(
          'Inserisci un link valido che inizi con http:// o https://.',
        ),
    }),
    defineField({
      name: 'location',
      title: 'Coordinate della mappa',
      description:
        'Coordinate geografiche precise. Sono facoltative e normalmente non servono se il link di Google Maps è corretto.',
      type: 'geopoint',
      group: 'location',
    }),
    defineField({
      name: 'seasonalInformation',
      title: 'Aperture e informazioni stagionali',
      description:
        'Indica periodi di apertura, chiusure stagionali o limitazioni per i visitatori. Lascia vuoto se non necessario.',
      type: 'localeTextRecommended',
      group: 'location',
      validation: (Rule) => Rule.custom(() => true),
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      description:
        'Contrassegna i luoghi che desideriamo mettere particolarmente in evidenza. Campo facoltativo.',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Ordine di visualizzazione',
      type: 'number',
      description:
        'I numeri più bassi appaiono prima nella categoria. Campo facoltativo.',
      group: 'content',
      validation: (Rule) =>
        Rule.integer()
          .min(0)
          .error('Inserisci un numero intero uguale o maggiore di zero.'),
    }),
  ],
  orderings: [
    {
      title: 'Ordine di visualizzazione',
      name: 'displayOrder',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'internalTitle',
      subtitle: 'category',
      media: 'photography.0.image',
    },
    prepare: ({media, subtitle, title}) => ({
      media,
      subtitle: categoryTitles[String(subtitle)] ?? 'Categoria non specificata',
      title,
    }),
  },
})
