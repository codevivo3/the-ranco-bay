import 'server-only'

import type {AppLocale} from '@/i18n/routing'

import {fetchDraftAwareSanity, fetchPublishedSanity} from './fetch'
import {normalizePropertyInformation} from './property-information-normalizer'
import {PROPERTY_INFORMATION_QUERY} from './queries'
import type {PropertyInformation, PropertyInformationDocument} from './types'

export type PropertyInformationResult =
  | {data: PropertyInformation; status: 'success'}
  | {data: null; status: 'missing'}
  | {data: null; status: 'unavailable'}

const queryOptions = {
  query: PROPERTY_INFORMATION_QUERY,
  label: 'property information',
  tags: ['sanity:property-information'],
}

async function getPropertyInformation(
  locale: AppLocale,
  preview: boolean,
): Promise<PropertyInformationResult> {
  const result = preview
    ? await fetchDraftAwareSanity<PropertyInformationDocument>(queryOptions)
    : await fetchPublishedSanity<PropertyInformationDocument>(queryOptions)

  if (result.status !== 'success') {
    return result.status === 'missing'
      ? {data: null, status: 'missing'}
      : {data: null, status: 'unavailable'}
  }

  const property = normalizePropertyInformation(result.data, locale)

  return property
    ? {data: property, status: 'success'}
    : {data: null, status: 'missing'}
}

export function getPublishedPropertyInformation(locale: AppLocale) {
  return getPropertyInformation(locale, false)
}

export function getDraftAwarePropertyInformation(locale: AppLocale) {
  return getPropertyInformation(locale, true)
}

export function isPropertyInformationReady(
  property: PropertyInformation,
): boolean {
  return [
    property.overview,
    property.arrivalAndParking,
    property.stayEssentials,
    property.assistance,
  ].some((section) => section && section.body.length > 0)
}
