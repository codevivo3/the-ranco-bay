import {defineQuery} from 'next-sanity'

export const APARTMENT_INTRODUCTION_QUERY = defineQuery(`
  *[_type == "apartment" && _id == $documentId][0] {
    _id,
    introduction {
      en[] { _key, _type, style, children[] { _key, _type, text } },
      it[] { _key, _type, style, children[] { _key, _type, text } },
      de[] { _key, _type, style, children[] { _key, _type, text } },
      fr[] { _key, _type, style, children[] { _key, _type, text } }
    }
  }
`)

export const LOCAL_GUIDE_ENTRIES_QUERY = defineQuery(`
  *[_type == "localGuideEntry"]
    | order(coalesce(displayOrder, 999999) asc, internalTitle asc) {
      _id,
      internalTitle,
      publicTitle { en, it, de, fr },
      subtitle { en, it, de, fr },
      description {
        en[] { _key, _type, style, children[] { _key, _type, text } },
        it[] { _key, _type, style, children[] { _key, _type, text } },
        de[] { _key, _type, style, children[] { _key, _type, text } },
        fr[] { _key, _type, style, children[] { _key, _type, text } }
      },
      category,
      photography[] {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      },
      mapsUrl,
      address,
      officialWebsite,
      telephone,
      location,
      seasonalInformation { en, it, de, fr },
      featured,
      displayOrder
    }
`)

export const PROPERTY_INFORMATION_QUERY = defineQuery(`
  *[_type == "propertyInformation" && _id == "propertyInformation"][0] {
    _id,
    overview {
      eyebrow { en, it, de, fr },
      heading { en, it, de, fr },
      body {
        en[] { _key, _type, style, children[] { _key, _type, text } },
        it[] { _key, _type, style, children[] { _key, _type, text } },
        de[] { _key, _type, style, children[] { _key, _type, text } },
        fr[] { _key, _type, style, children[] { _key, _type, text } }
      },
      image {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      },
      linkLabel { en, it, de, fr }
    },
    arrivalAndParking {
      eyebrow { en, it, de, fr },
      heading { en, it, de, fr },
      body {
        en[] { _key, _type, style, children[] { _key, _type, text } },
        it[] { _key, _type, style, children[] { _key, _type, text } },
        de[] { _key, _type, style, children[] { _key, _type, text } },
        fr[] { _key, _type, style, children[] { _key, _type, text } }
      },
      image {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      },
      linkLabel { en, it, de, fr }
    },
    stayEssentials {
      eyebrow { en, it, de, fr },
      heading { en, it, de, fr },
      body {
        en[] { _key, _type, style, children[] { _key, _type, text } },
        it[] { _key, _type, style, children[] { _key, _type, text } },
        de[] { _key, _type, style, children[] { _key, _type, text } },
        fr[] { _key, _type, style, children[] { _key, _type, text } }
      },
      image {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      },
      linkLabel { en, it, de, fr }
    },
    assistance {
      eyebrow { en, it, de, fr },
      heading { en, it, de, fr },
      body {
        en[] { _key, _type, style, children[] { _key, _type, text } },
        it[] { _key, _type, style, children[] { _key, _type, text } },
        de[] { _key, _type, style, children[] { _key, _type, text } },
        fr[] { _key, _type, style, children[] { _key, _type, text } }
      },
      image {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      },
      linkLabel { en, it, de, fr }
    },
    exteriorPhotography[] {
      _key,
      image {
        asset,
        crop,
        hotspot,
        "dimensions": asset->metadata.dimensions
      },
      alternativeText { en, it, de, fr }
    },
    seo {
      title { en, it, de, fr },
      description { en, it, de, fr },
      socialImage {
        _key,
        image {
          asset,
          crop,
          hotspot,
          "dimensions": asset->metadata.dimensions
        },
        alternativeText { en, it, de, fr }
      }
    }
  }
`)
