import type {PropertyGalleryFormat} from '@/features/property/property-images'

import type {GuideCategory} from './placeholder-data'

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
  seasonalInformation?: string
  tags: readonly string[]
  telephone?: string
  telephoneUrl?: string
  title: string
}
