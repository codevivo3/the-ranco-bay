import 'server-only'

import {stegaClean} from 'next-sanity'

import type {AppLocale} from '@/i18n/routing'

import {buildEditorialImageUrl} from './images'
import type {
  EditorialTextBlock,
  LocalizedEditorialSection,
  LocalizedRichText,
  LocalizedString,
  PropertyInformation,
  PropertyInformationDocument,
  PropertyPhotograph,
  SanityBlock,
  SanityEditorialImage,
  SanityEditorialSection,
  SanityLocalizedSeo,
} from './types'

function localizedValue(
  value: LocalizedString | null | undefined,
  locale: AppLocale,
) {
  if (!value) return undefined

  if (Object.hasOwn(value, locale)) {
    const localized = value[locale]
    return typeof localized === 'string'
      ? stegaClean(localized).trim() || undefined
      : undefined
  }

  const fallback = value.en
  return typeof fallback === 'string'
    ? stegaClean(fallback).trim() || undefined
    : undefined
}

function blockKind(style: string | undefined): EditorialTextBlock['kind'] {
  const cleanStyle = stegaClean(style)

  if (cleanStyle === 'blockquote') return 'quote'
  if (cleanStyle?.startsWith('h')) return 'heading'
  return 'paragraph'
}

function normalizeBlocks(
  blocks: SanityBlock[],
  keyPrefix: string,
): EditorialTextBlock[] {
  return blocks.flatMap((block, index) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return []

    const text = block.children
      .map((child) =>
        typeof child.text === 'string' ? stegaClean(child.text) : '',
      )
      .join('')
      .trim()

    if (!text) return []

    return [
      {
        key: block._key || `${keyPrefix}-${index}`,
        kind: blockKind(block.style),
        text,
      },
    ]
  })
}

function localizedBlocks(
  value: LocalizedRichText | null | undefined,
  locale: AppLocale,
  keyPrefix: string,
) {
  if (!value) return []

  if (Object.hasOwn(value, locale)) {
    return Array.isArray(value[locale])
      ? normalizeBlocks(value[locale], `${keyPrefix}-${locale}`)
      : []
  }

  return Array.isArray(value.en)
    ? normalizeBlocks(value.en, `${keyPrefix}-en`)
    : []
}

function normalizeImage(
  value: SanityEditorialImage | null | undefined,
  locale: AppLocale,
  fallbackId: string,
): PropertyPhotograph | undefined {
  if (!value) return undefined

  const image = value.image
  const assetReference = image?.asset?._ref
  if (!assetReference) return undefined

  try {
    const dimensions = image.dimensions

    return {
      alt: localizedValue(value.alternativeText, locale) ?? '',
      height:
        typeof dimensions?.height === 'number' ? dimensions.height : undefined,
      id: stegaClean(value._key || assetReference || fallbackId),
      src: buildEditorialImageUrl(image),
      width:
        typeof dimensions?.width === 'number' ? dimensions.width : undefined,
    }
  } catch {
    return undefined
  }
}

function normalizeSection(
  value: SanityEditorialSection | null | undefined,
  locale: AppLocale,
  keyPrefix: string,
): LocalizedEditorialSection | undefined {
  if (!value) return undefined

  const section: LocalizedEditorialSection = {
    body: localizedBlocks(value.body, locale, `${keyPrefix}-body`),
    eyebrow: localizedValue(value.eyebrow, locale),
    heading: localizedValue(value.heading, locale),
    image: normalizeImage(value.image, locale, `${keyPrefix}-image`),
    linkLabel: localizedValue(value.linkLabel, locale),
  }

  return section.body.length > 0 ||
    section.eyebrow ||
    section.heading ||
    section.image ||
    section.linkLabel
    ? section
    : undefined
}

function normalizeSeo(
  value: SanityLocalizedSeo | null | undefined,
  locale: AppLocale,
) {
  if (!value) return undefined

  const seo = {
    description: localizedValue(value.description, locale),
    socialImage: normalizeImage(value.socialImage, locale, 'property-seo'),
    title: localizedValue(value.title, locale),
  }

  return seo.description || seo.socialImage || seo.title ? seo : undefined
}

export function normalizePropertyInformation(
  document: PropertyInformationDocument,
  locale: AppLocale,
): PropertyInformation | null {
  if (!document || typeof document._id !== 'string') return null

  const exteriorPhotography = Array.isArray(document.exteriorPhotography)
    ? document.exteriorPhotography.flatMap((photograph, index) => {
        const normalized = normalizeImage(
          photograph,
          locale,
          `property-exterior-${index}`,
        )
        return normalized ? [normalized] : []
      })
    : []

  return {
    arrivalAndParking: normalizeSection(
      document.arrivalAndParking,
      locale,
      'property-arrival',
    ),
    assistance: normalizeSection(
      document.assistance,
      locale,
      'property-assistance',
    ),
    exteriorPhotography,
    id: stegaClean(document._id),
    overview: normalizeSection(document.overview, locale, 'property-overview'),
    seo: normalizeSeo(document.seo, locale),
    stayEssentials: normalizeSection(
      document.stayEssentials,
      locale,
      'property-stay',
    ),
  }
}
