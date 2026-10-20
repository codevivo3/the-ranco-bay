import type {AppLocale} from '@/i18n/routing'

export type SanitySpan = {
  _key?: string
  _type?: string
  text?: string
}

export type SanityBlock = {
  _key?: string
  _type?: string
  children?: SanitySpan[]
  style?: string
}

export type LocalizedRichText = Partial<
  Record<AppLocale, SanityBlock[] | null>
>

export type LocalizedString = Partial<Record<AppLocale, string | null>>

export type ApartmentIntroductionDocument = {
  _id: string
  introduction?: LocalizedRichText | null
}

export type EditorialTextBlock = {
  key: string
  kind: 'heading' | 'paragraph' | 'quote'
  text: string
}

export type ApartmentIntroduction = {
  apartmentId: 'ground-floor' | 'upper-floor'
  blocks: EditorialTextBlock[]
}

export type SanityGuideImage = {
  asset?: {_ref?: string; _type?: string}
  crop?: {bottom?: number; left?: number; right?: number; top?: number}
  dimensions?: {aspectRatio?: number; height?: number; width?: number}
  hotspot?: {height?: number; width?: number; x?: number; y?: number}
}

export type LocalGuideEntryDocument = {
  _id: string
  address?: string | null
  category?: string
  description?: LocalizedRichText | null
  displayOrder?: number
  featured?: boolean
  internalTitle?: string
  location?: {lat?: number; lng?: number}
  mapsUrl?: string | null
  officialWebsite?: string | null
  photography?: Array<{
    _key?: string
    alternativeText?: LocalizedString | null
    image?: SanityGuideImage | null
  }> | null
  publicTitle?: LocalizedString | null
  seasonalInformation?: LocalizedString | null
  telephone?: string | null
}
