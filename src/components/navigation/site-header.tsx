import {getTranslations} from "next-intl/server";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {routing} from "@/i18n/routing";
import {Container} from "@/components/layout/container";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className='border-b border-page-border bg-page-surface'>
      <Container className='grid grid-cols-[1fr_auto_1fr] items-center gap-5 py-4'>
        <Link className='flex items-center gap-2' href='/' aria-label={t('brand')}>
          <Image
            src='/logo/trb-logo-image-plain.svg'
            alt=''
            width={40}
            height={40}
            priority
          />
          <Image
            src='/logo/trb-logo-typography-plain.svg'
            alt=''
            width={150}
            height={50}
            priority
          />
        </Link>
        <nav className='justify-self-center' aria-label={t('primaryLabel')}>
          <ul className='flex flex-wrap gap-x-5 gap-y-2 text-sm'>
            <li>
              <Link href='/#stay'>{t('stay')}</Link>
            </li>
            <li>
              <Link href='/#story'>{t('story')}</Link>
            </li>
            <li>
              <Link href='/#guide'>{t('guide')}</Link>
            </li>
            <li>
              <Link href='/#location'>{t('location')}</Link>
            </li>
          </ul>
        </nav>
        <nav className='justify-self-end' aria-label={t('languageLabel')}>
          <ul className='flex gap-3 text-xs uppercase tracking-[0.12em]'>
            {routing.locales.map((locale) => (
              <li key={locale}>
                <Link href='/' locale={locale} hrefLang={locale}>
                  {t(`locales.${locale}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
