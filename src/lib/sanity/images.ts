import 'server-only'

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'

import type {PropertyGalleryFormat} from '@/features/property/property-images'

import {sanityDataset, sanityProjectId} from './config'

const imageBuilder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
})

const imageSizes: Record<PropertyGalleryFormat, {height: number; width: number}> = {
  landscape: {width: 1800, height: 1200},
  portrait: {width: 1200, height: 1800},
  square: {width: 1600, height: 1600},
}

export function buildGuideImageUrl(
  source: SanityImageSource,
  format: PropertyGalleryFormat,
) {
  const {height, width} = imageSizes[format]

  return imageBuilder
    .image(source)
    .width(width)
    .height(height)
    .fit('crop')
    .quality(85)
    .auto('format')
    .url()
}

export function buildEditorialImageUrl(source: SanityImageSource) {
  return imageBuilder
    .image(source)
    .width(1800)
    .quality(85)
    .auto('format')
    .url()
}
