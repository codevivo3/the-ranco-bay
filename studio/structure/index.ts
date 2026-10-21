import {CogIcon} from '@sanity/icons/Cog'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {HomeIcon} from '@sanity/icons/Home'
import {PinIcon} from '@sanity/icons/Pin'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('content-studio')
    .title('Contenuti del sito')
    .items([
      S.listItem().singleton('homepage').title('Pagina iniziale').icon(HomeIcon),
      S.listItem()
        .id('apartments')
        .title('Appartamenti')
        .icon(HomeIcon)
        .child(
          S.list()
            .id('apartments-list')
            .title('Appartamenti')
            .items([
              S.listItem().singleton('ground-floor').title('Veranda').icon(HomeIcon),
              S.listItem().singleton('upper-floor').title('Mansarda').icon(HomeIcon),
            ]),
        ),
      S.listItem()
        .singleton('propertyInformation')
        .title('La proprietà')
        .icon(EarthGlobeIcon),
      S.documentTypeListItem('localGuideEntry')
        .title('Guida locale')
        .icon(PinIcon)
        .showCount(),
      S.divider(),
      S.listItem()
        .singleton('websiteSettings')
        .title('Impostazioni del sito')
        .icon(CogIcon),
    ])
