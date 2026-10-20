import 'server-only'

import type {AppLocale} from '@/i18n/routing'
import {
  isApartmentId,
  type ApartmentId,
} from '@/features/accommodation/apartments'

import {fetchDraftAwareSanity, fetchPublishedSanity} from './fetch'
import {normalizeApartmentIntroduction} from './normalizers'
import {APARTMENT_INTRODUCTION_QUERY} from './queries'
import type {
  ApartmentIntroduction,
  ApartmentIntroductionDocument,
} from './types'

type IntroductionResult =
  | {data: ApartmentIntroduction; status: 'success'}
  | {data: null; status: 'missing' | 'unavailable'}

function queryOptions(apartmentId: ApartmentId) {
  return {
    query: APARTMENT_INTRODUCTION_QUERY,
    params: {documentId: apartmentId},
    label: `${apartmentId} introduction`,
    tags: [`sanity:apartment:${apartmentId}`],
  }
}

async function getIntroduction(
  apartmentId: ApartmentId,
  locale: AppLocale,
  preview: boolean,
): Promise<IntroductionResult> {
  if (!isApartmentId(apartmentId)) {
    return {data: null, status: 'missing'}
  }

  const result = preview
    ? await fetchDraftAwareSanity<ApartmentIntroductionDocument>(
        queryOptions(apartmentId),
      )
    : await fetchPublishedSanity<ApartmentIntroductionDocument>(
        queryOptions(apartmentId),
      )

  if (result.status !== 'success') return result

  const introduction = normalizeApartmentIntroduction(
    result.data,
    apartmentId,
    locale,
  )

  return introduction
    ? {data: introduction, status: 'success'}
    : {data: null, status: 'missing'}
}

export function getPublishedApartmentIntroduction(
  apartmentId: ApartmentId,
  locale: AppLocale,
) {
  return getIntroduction(apartmentId, locale, false)
}

export function getDraftAwareApartmentIntroduction(
  apartmentId: ApartmentId,
  locale: AppLocale,
) {
  return getIntroduction(apartmentId, locale, true)
}
