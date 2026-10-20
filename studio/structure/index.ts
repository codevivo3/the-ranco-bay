import {CogIcon} from '@sanity/icons/Cog'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {HomeIcon} from '@sanity/icons/Home'
import {PinIcon} from '@sanity/icons/Pin'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('content-studio')
    .title('Content Studio')
    .items([
      S.listItem().singleton('homepage').title('Homepage').icon(HomeIcon),
      S.listItem()
        .id('apartments')
        .title('Apartments')
        .icon(HomeIcon)
        .child(
          S.list()
            .id('apartments-list')
            .title('Apartments')
            .items([
              S.listItem().singleton('ground-floor').title('Veranda').icon(HomeIcon),
              S.listItem().singleton('upper-floor').title('Mansarda').icon(HomeIcon),
            ]),
        ),
      S.listItem()
        .singleton('propertyInformation')
        .title('The Property')
        .icon(EarthGlobeIcon),
      S.documentTypeListItem('localGuideEntry')
        .title('Local Guide')
        .icon(PinIcon)
        .showCount(),
      S.divider(),
      S.listItem()
        .singleton('websiteSettings')
        .title('Website Settings')
        .icon(CogIcon),
    ])
