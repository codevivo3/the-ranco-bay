import type {SanityImageSource} from '@sanity/image-url'
import {stegaClean} from 'next-sanity'

import {guideCategories, type GuideCategory} from '@/features/local-guide/placeholder-data'
import type {LocalGuideEntry} from '@/features/local-guide/types'
import type {PropertyGalleryFormat} from '@/features/property/property-images'
import type {AppLocale} from '@/i18n/routing'

import {buildGuideImageUrl} from './images'
import type {
  LocalGuideEntryDocument,
  LocalizedRichText,
  LocalizedString,
  SanityGuideImage,
} from './types'

function isGuideCategory(value: string): value is GuideCategory {
  return guideCategories.some((category) => category === value)
}

function localizedString(value: LocalizedString | null | undefined, locale: AppLocale) {
  const preferred = value?.[locale]?.trim()
  if (preferred) return preferred
  return value?.en?.trim() || ''
}

function localizedRichText(value: LocalizedRichText | null | undefined, locale: AppLocale) {
  const blocks = value?.[locale]?.length ? value[locale] : value?.en
  if (!Array.isArray(blocks)) return ''

  return blocks
    .flatMap((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return []
      const text = block.children.map((child) => child.text ?? '').join('').trim()
      return text ? [text] : []
    })
    .join('\n\n')
}

function imageFormat(image: SanityGuideImage): PropertyGalleryFormat {
  const width = image.dimensions?.width
  const height = image.dimensions?.height
  if (!width || !height) return 'landscape'

  const crop = image.crop
  const croppedWidth = width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
  const croppedHeight = height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
  const ratio = croppedWidth / croppedHeight

  if (ratio < 0.85) return 'portrait'
  if (ratio > 1.2) return 'landscape'
  return 'square'
}

function safeHttpUrl(value: string | null | undefined) {
  if (!value) return undefined

  try {
    const cleanValue = stegaClean(value)
    const url = new URL(cleanValue)
    return ['http:', 'https:'].includes(url.protocol) ? cleanValue : undefined
  } catch {
    return undefined
  }
}

function safeTelephone(value: string | null | undefined) {
  if (!value) return undefined

  const telephone = stegaClean(value).trim()
  const digits = telephone.replace(/\D/g, '')
  if (
    !/^\+?[0-9][0-9\s()./-]*[0-9]$/.test(telephone) ||
    digits.length < 6 ||
    digits.length > 20 ||
    telephone.length > 40
  ) {
    return undefined
  }

  const prefix = telephone.startsWith('+') ? '+' : ''
  return {telephone, telephoneUrl: `tel:${prefix}${digits}`}
}

export function normalizeLocalGuideEntry(
  document: LocalGuideEntryDocument,
  locale: AppLocale,
): LocalGuideEntry | null {
  const category = stegaClean(document.category ?? '')
  const title = localizedString(document.publicTitle, locale)
  if (!isGuideCategory(category) || !title) return null

  const photograph = document.photography?.find(({image}) => image?.asset?._ref)
  const format = photograph?.image ? imageFormat(photograph.image) : 'landscape'
  const image = photograph?.image
    ? buildGuideImageUrl(photograph.image as SanityImageSource, format)
    : undefined
  const telephone = safeTelephone(document.telephone)

  return {
    id: document._id.replace(/^drafts\./, ''),
    address: document.address?.trim() || undefined,
    category,
    title,
    description: localizedRichText(document.description, locale),
    image,
    imageAlt: stegaClean(localizedString(photograph?.alternativeText, locale)),
    format,
    mapsUrl: safeHttpUrl(document.mapsUrl),
    officialWebsite: safeHttpUrl(document.officialWebsite),
    seasonalInformation:
      localizedString(document.seasonalInformation, locale) || undefined,
    featured: document.featured === true,
    displayOrder: document.displayOrder ?? Number.MAX_SAFE_INTEGER,
    tags: [],
    ...telephone,
  }
}
