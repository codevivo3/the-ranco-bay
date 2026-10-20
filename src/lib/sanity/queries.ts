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
