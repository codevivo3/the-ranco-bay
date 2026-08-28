import { getTranslations } from 'next-intl/server';

import { HomeLogoLink } from '@/components/navigation/home-logo-link';
import { Link } from '@/i18n/navigation';

import { Container } from './container';

export async function SiteFooter() {
  const t = await getTranslations('Common.Footer');
  const navigation = await getTranslations('Navigation');
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-page-border bg-page-surface py-6'>
      <Container>
        <div className='flex flex-col gap-6 text-sm text-page-muted'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <HomeLogoLink ariaLabel={t('brand')} />

            <p className='uppercase'>{t('location')}</p>
          </div>

          <div className='border-t border-page-border pt-4 text-xs text-page-muted'>
            © {year} The Ranco Bay · CodeVivo
          </div>
        </div>
      </Container>
    </footer>
  );
}
