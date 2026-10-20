import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';
import { TrbButton } from '@/components/ui/trb-button';

export default async function NotFound() {
  const t = await getTranslations('Common.NotFound');

  return (
    <main
      id='main-content'
      className='relative flex min-h-[100svh] items-center overflow-hidden bg-page-surface py-[var(--space-section)] pt-28'
    >
      {/* House watermark: repositioned and rotated */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-[8%] bottom-[4%] z-0 rotate-[-18deg] sm:right-[2%] lg:right-[8%]'
      >
        <EditorialWatermark opacity={0.1} variant='lower-right' />
      </div>

      {/* Editorial content */}
      <Container className='relative z-10 text-left'>
        <div className='max-w-2xl'>
          {/* Decorative 404 */}
          <div
            aria-hidden='true'
            className='pointer-events-none mb-8 select-none font-display text-[8rem] leading-none text-[var(--trb-lagoon)] opacity-[0.08] sm:text-[12rem] lg:text-[18rem]'
          >
            404
          </div>

          <h1 className='editorial-statement text-page-text-strong'>
            {t('title')}
          </h1>

          <p className='mt-6 text-[1.125rem] leading-7 text-page-text sm:text-[1.25rem] sm:leading-8'>
            {t('supportingText')}
          </p>

          <p className='mt-4 max-w-xl text-[1rem] leading-7 text-page-muted sm:text-[1.125rem]'>
            {t('description')}
          </p>

          <TrbButton className='mt-9' href='/'>
            {t('returnHome')}
          </TrbButton>
        </div>
      </Container>
    </main>
  );
}
