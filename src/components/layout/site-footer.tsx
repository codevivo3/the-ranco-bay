import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { HomeLogoLink } from '@/components/navigation/home-logo-link';
import { Link } from '@/i18n/navigation';
import { trbBusiness } from '@/lib/constants/business';

import { Container } from './container';

export async function SiteFooter() {
  const t = await getTranslations('Common.Footer');
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-page-border bg-page-surface py-6'>
      <Container>
        <div className='flex flex-col gap-6 text-sm text-page-muted'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <HomeLogoLink ariaLabel={trbBusiness.name} />

            <div className='sm:text-right'>
              <p className='uppercase'>{t('location')}</p>
              <Link
                href='/contact#contact-details'
                className='mt-2 inline-flex text-sm text-[var(--trb-lagoon)] underline decoration-transparent underline-offset-4 transition-colors hover:text-page-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus'
              >
                {t('contact')}
              </Link>
            </div>
          </div>

          <div className='flex items-center gap-1.5 border-t border-page-border pt-4 text-xs text-page-muted'>
            <span className='font-medium text-[var(--trb-lagoon)]'>
              © {year} {trbBusiness.name} ·
            </span>

            <a
              href='https://codevivo.dev/en'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 transition-colors hover:text-[var(--trb-lagoon)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus'
              aria-label='CodeVivo — opens in a new tab'
            >
              <span className='font-medium text-[var(--trb-lagoon)]'>
                CodeVivo
              </span>
              <Image
                src='/logo/codevivo-logo/codevivo-icon-color.svg'
                alt=''
                aria-hidden='true'
                width={200}
                height={200}
                className='h-3.5 w-auto shrink-0'
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
