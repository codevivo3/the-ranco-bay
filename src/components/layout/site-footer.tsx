import { getTranslations } from 'next-intl/server';

import { Container } from './container';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export async function SiteFooter() {
  const t = await getTranslations('Common.Footer');

  return (
    <footer className='border-t border-page-border bg-page-surface py-5'>
      <Container className='flex flex-wrap justify-between gap-3 text-sm text-page-muted'>
        <Link
          className='flex items-center gap-2'
          href='/#top'
          aria-label={t('brand')}
        >
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
        <p>{t('location')}</p>
      </Container>
    </footer>
  );
}
