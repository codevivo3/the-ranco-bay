export const supportedLanguages = [
  {id: 'en', title: 'Inglese'},
  {id: 'it', title: 'Italiano'},
  {id: 'de', title: 'Tedesco'},
  {id: 'fr', title: 'Francese'},
] as const

export const localeIds = supportedLanguages.map(({id}) => id)

export function getLocalizedPath(locale: string, path = '') {
  const suffix = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') return suffix || '/'
  return suffix ? `/${locale}${suffix}` : `/${locale}/`
}
