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
  subtitle?: LocalizedString | null
  seasonalInformation?: LocalizedString | null
  telephone?: string | null
}

export type SanityEditorialImage = {
  _key?: string
  alternativeText?: LocalizedString | null
  image?: SanityGuideImage | null
}

export type SanityEditorialSection = {
  body?: LocalizedRichText | null
  eyebrow?: LocalizedString | null
  heading?: LocalizedString | null
  image?: SanityEditorialImage | null
  linkLabel?: LocalizedString | null
}

export type SanityLocalizedSeo = {
  description?: LocalizedString | null
  socialImage?: SanityEditorialImage | null
  title?: LocalizedString | null
}

export type PropertyInformationDocument = {
  _id: string
  arrivalAndParking?: SanityEditorialSection | null
  assistance?: SanityEditorialSection | null
  exteriorPhotography?: SanityEditorialImage[] | null
  overview?: SanityEditorialSection | null
  seo?: SanityLocalizedSeo | null
  stayEssentials?: SanityEditorialSection | null
}

export type PropertyPhotograph = {
  alt: string
  height?: number
  id: string
  src: string
  width?: number
}

export type LocalizedEditorialSection = {
  body: EditorialTextBlock[]
  eyebrow?: string
  heading?: string
  image?: PropertyPhotograph
  linkLabel?: string
}

export type LocalizedPropertySeo = {
  description?: string
  socialImage?: PropertyPhotograph
  title?: string
}

export type PropertyInformation = {
  arrivalAndParking?: LocalizedEditorialSection
  assistance?: LocalizedEditorialSection
  exteriorPhotography: PropertyPhotograph[]
  id: string
  overview?: LocalizedEditorialSection
  seo?: LocalizedPropertySeo
  stayEssentials?: LocalizedEditorialSection
}
