import 'server-only'

import type {LocalGuideEntry} from '@/features/local-guide/types'
import type {AppLocale} from '@/i18n/routing'

import {fetchDraftAwareSanity} from './fetch'
import {normalizeLocalGuideEntry} from './local-guide-normalizer'
import {LOCAL_GUIDE_ENTRIES_QUERY} from './queries'
import type {LocalGuideEntryDocument} from './types'

export async function getLocalGuideEntries(locale: AppLocale) {
  const result = await fetchDraftAwareSanity<LocalGuideEntryDocument[]>({
    query: LOCAL_GUIDE_ENTRIES_QUERY,
    label: 'local guide entries',
    tags: ['sanity:local-guide'],
    revalidate: 30,
  })

  if (result.status !== 'success') return result

  const entries = result.data
    .map((document) => normalizeLocalGuideEntry(document, locale))
    .filter((entry): entry is LocalGuideEntry => entry !== null)

  return entries.length > 0
    ? {data: entries, status: 'success' as const}
    : {data: null, status: 'missing' as const}
}
