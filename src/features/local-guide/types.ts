import type {PropertyGalleryFormat} from '@/features/property/property-images'

import type {GuideCategory} from './placeholder-data'

export type LocalGuidePhotograph = {
  alt: string
  format: PropertyGalleryFormat
  id: string
  imagePosition?: string
  src: string
}

export type LocalGuideEntry = {
  address?: string
  category: GuideCategory
  description: string
  displayOrder: number
  featured: boolean
  format: PropertyGalleryFormat
  id: string
  image?: string
  imageAlt: string
  imagePosition?: string
  mapsUrl?: string
  officialWebsite?: string
  photography: readonly LocalGuidePhotograph[]
  seasonalInformation?: string
  subtitle?: string
  tags: readonly string[]
  telephone?: string
  telephoneUrl?: string
  title: string
}
