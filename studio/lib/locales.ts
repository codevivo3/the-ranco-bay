export const supportedLanguages = [
  {id: 'en', title: 'Inglese'},
  {id: 'it', title: 'Italiano'},
  {id: 'de', title: 'Tedesco'},
  {id: 'fr', title: 'Francese'},
] as const

export const localeIds = supportedLanguages.map(({id}) => id)
