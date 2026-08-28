'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleNavigation() {
  const t = useTranslations('Navigation');
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      className='col-start-2 row-start-1 justify-self-end font-semibold sm:col-start-3'
      aria-label={t('languageLabel')}
    >
      <ul className='flex gap-3 text-xs uppercase tracking-[0.12em]'>
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              hrefLang={locale}
              aria-current={locale === activeLocale ? 'page' : undefined}
              className={`relative pb-1 transition-opacity duration-180 ${
                locale === activeLocale
                  ? 'opacity-100 after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[var(--trb-lagoon)]'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {t(`locales.${locale}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
