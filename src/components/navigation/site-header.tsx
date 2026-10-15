import { getTranslations } from 'next-intl/server';

import {Container} from "@/components/layout/container";
import {
  HomeLogoLink,
  HomeLogoSymbolLink,
  HomeLogoTypographyLink,
} from "@/components/navigation/home-logo-link";
import {LocaleNavigation} from "@/components/navigation/locale-navigation";
import {MobileNavigation} from "@/components/navigation/mobile-navigation";
import {PrimaryNavigation} from "@/components/navigation/primary-navigation";
import {ScrollAwareHeader} from "@/components/navigation/scroll-aware-header";
import {trbBusiness} from "@/lib/constants/business";

export async function SiteHeader() {
  const t = await getTranslations('Navigation');

  return (
    <ScrollAwareHeader
      className='trb-navbar-glass fixed inset-x-0 top-0 z-[60] border-b'
    >
      <Container className='relative z-[1] grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center lg:hidden'>
        <HomeLogoSymbolLink ariaLabel={trbBusiness.name} />
        <HomeLogoTypographyLink ariaLabel={trbBusiness.name} />
        <div className='justify-self-end'>
          <MobileNavigation
            labels={{
              apartments: t('apartments'),
              availability: t('availability'),
              closeMenu: t('closeMenu'),
              comingSoon: t('comingSoon'),
              contact: t('contact'),
              discover: t('discover'),
              groundFloor: t('groundFloor'),
              guide: t('guide'),
              language: t('languageLabel'),
              locales: {
                de: t('locales.de'),
                en: t('locales.en'),
                fr: t('locales.fr'),
                it: t('locales.it'),
              },
              openMenu: t('openMenu'),
              primary: t('primaryLabel'),
              property: t('property'),
              upperFloor: t('upperFloor'),
            }}
          />
        </div>
      </Container>

      <Container className='relative z-[1] hidden grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3 py-4 sm:grid-cols-[1fr_auto_1fr] lg:grid lg:max-w-none lg:gap-x-0 lg:[&>a:first-child]:justify-self-center lg:[&>nav:last-child]:justify-self-center'>
        <HomeLogoLink ariaLabel={trbBusiness.name} />
        <PrimaryNavigation
          labels={{
            apartments: t('apartments'),
            availability: t('availability'),
            comingSoon: t('comingSoon'),
            contact: t('contact'),
            discover: t('discover'),
            groundFloor: t('groundFloor'),
            guide: t('guide'),
            primary: t('primaryLabel'),
            property: t('property'),
            upperFloor: t('upperFloor'),
          }}
        />
        <LocaleNavigation />
      </Container>
    </ScrollAwareHeader>
  );
}
