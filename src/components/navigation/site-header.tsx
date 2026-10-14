import { getTranslations } from 'next-intl/server';

import {Container} from "@/components/layout/container";
import {HomeLogoLink} from "@/components/navigation/home-logo-link";
import {LocaleNavigation} from "@/components/navigation/locale-navigation";
import {PrimaryNavigation} from "@/components/navigation/primary-navigation";
import {ScrollAwareHeader} from "@/components/navigation/scroll-aware-header";
import {trbBusiness} from "@/lib/constants/business";

export async function SiteHeader() {
  const t = await getTranslations('Navigation');

  return (
    <ScrollAwareHeader
      className='trb-navbar-glass fixed inset-x-0 top-0 z-[60] border-b'
    >
      <Container className='relative z-[1] grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3 py-4 sm:grid-cols-[1fr_auto_1fr]'>
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
