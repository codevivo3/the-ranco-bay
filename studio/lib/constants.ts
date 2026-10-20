export const apartmentDocuments = [
  {id: 'ground-floor', title: 'Veranda'},
  {id: 'upper-floor', title: 'Mansarda'},
] as const

export const protectedDocumentIds = new Set([
  'homepage',
  'ground-floor',
  'upper-floor',
  'propertyInformation',
  'websiteSettings',
])

export function withoutDraftPrefix(documentId: string) {
  return documentId.replace(/^drafts\./, '')
}
