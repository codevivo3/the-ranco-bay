import {amenity} from './amenity'
import {apartmentPhotography} from './apartment-photography'
import {cinematicHero, heroScene} from './cinematic-hero'
import {editorialImage} from './editorial-image'
import {editorialSection} from './editorial-section'
import {localizedTypes} from './localized'
import {seo} from './seo'

export const objectSchemas = [
  ...localizedTypes,
  editorialImage,
  heroScene,
  cinematicHero,
  editorialSection,
  apartmentPhotography,
  amenity,
  seo,
]
