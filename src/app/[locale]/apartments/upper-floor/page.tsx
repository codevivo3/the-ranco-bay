import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OwnerContactBlock } from '@/components/contact/owner-contact-block';
import { Container } from '@/components/layout/container';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';
import { TrbButton } from '@/components/ui/trb-button';
import { getLocalizedPageMetadata } from '@/lib/seo/localized-page-metadata';

type UpperFloorPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: UpperFloorPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getLocalizedPageMetadata(locale, 'upperFloor');
}

export default async function UpperFloorPage({ params }: UpperFloorPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('UpperFloor');
  const commonContact = await getTranslations('Common.DirectContact');

  return (
    <main id='main-content'>
      <section className='relative flex min-h-[100svh] items-center overflow-hidden bg-page-surface pt-28'>
        <EditorialWatermark variant='lower-right' />
        <Container className='relative z-10 py-[var(--space-section)]'>
          <div className='grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20'>
            <div className='max-w-4xl'>
              <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
                {t('eyebrow')}
              </p>
              <h1 className='editorial-statement mt-5 text-page-text-strong'>
                {t('title')}
              </h1>
              <p className='mt-7 max-w-2xl text-[1.125rem] leading-7 text-page-muted sm:text-[1.25rem] sm:leading-8 lg:text-[1.375rem]'>
                {t('body')}
              </p>
              <p className='mt-5 max-w-2xl text-base leading-7 text-page-muted'>
                {t('availability')}
              </p>
              <TrbButton
                className='mt-8'
                href='/contact?apartment=upper-floor#enquiry'
              >
                {t('enquire')}
              </TrbButton>
            </div>

            <div className='trb-editorial-glass p-[clamp(1.5rem,4vw,3rem)]'>
              <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
                {t('contactEyebrow')}
              </p>
              <h2 className='mt-4 font-display text-[clamp(2rem,4vw,3.75rem)] leading-none text-page-text-strong'>
                {t('contactTitle')}
              </h2>
              <div className='mt-8 border-y border-page-border py-5'>
                <OwnerContactBlock
                  label={commonContact('label')}
                  qrLabel={commonContact('vcard')}
                  whatsappLabel={commonContact('whatsapp')}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
