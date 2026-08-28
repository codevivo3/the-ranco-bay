import {getTranslations} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {HomeLogoLink} from "@/components/navigation/home-logo-link";
import {LocaleNavigation} from "@/components/navigation/locale-navigation";
import {Link} from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header
      className='fixed inset-x-0 top-0 z-[60] border-b bg-[color-mix(in_srgb,var(--trb-lagoon)_18%,color-mix(in_srgb,var(--trb-sand)_55%,transparent))] shadow-[0_1px_12px_color-mix(in_srgb,var(--trb-walnut)_8%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--trb-sand)_24%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.15]'
      style={{
        borderBottomColor:
          'color-mix(in srgb, var(--trb-walnut) 11%, transparent)',
      }}
    >
      <Container className='grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3 py-4 sm:grid-cols-[1fr_auto_1fr]'>
        <HomeLogoLink ariaLabel={t('brand')} />
        <nav className='col-span-2 row-start-2 justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1' aria-label={t('primaryLabel')}>
          <ul className='flex flex-wrap gap-x-5 gap-y-2 text-sm'>
            <li>
              <Link href='/house'>{t('house')}</Link>
            </li>
            <li>
              <Link href='/guide'>{t('guide')}</Link>
            </li>
            <li>
              <Link href='/contact'>{t('contact')}</Link>
            </li>
          </ul>
        </nav>
        <LocaleNavigation />
      </Container>
    </header>
  );
}
