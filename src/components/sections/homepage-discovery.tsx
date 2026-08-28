import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { TrbButton } from '@/components/ui/trb-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { GuideCard } from '@/features/local-guide/guide-card';
import { getHomepageGuideEntries } from '@/features/local-guide/placeholder-data';

const propertyFacts = [
  'lakeView',
  'privateBeach',
  'parking',
  'equipped',
] as const;

const homepageSectionLayout =
  'flex min-h-[100svh] items-center py-[var(--space-section)]';

export async function HomepageDiscovery() {
  const [home, guide] = await Promise.all([
    getTranslations('Home'),
    getTranslations('Guide'),
  ]);
  const guideEntries = getHomepageGuideEntries();

  return (
    <>
      <section className={`${homepageSectionLayout} bg-page-surface`}>
        <Container className='w-full'>
          <div className='grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20'>
            <div className='relative mx-auto aspect-square w-full max-w-[36rem] overflow-hidden lg:mx-0'>
              <Image
                src='/images/property/image1.jpg'
                alt={home('HousePreview.imageAlt')}
                fill
                sizes='(min-width: 1024px) 55vw, 100vw'
                className='object-cover'
              />
            </div>
            <div>
              <SectionHeading
                eyebrow={home('HousePreview.eyebrow')}
                title={home('HousePreview.title')}
                body={home('HousePreview.body')}
              />
              <ul className='mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-page-border py-6 text-sm text-page-text'>
                {propertyFacts.map((fact) => (
                  <li key={fact}>{home(`HousePreview.facts.${fact}`)}</li>
                ))}
              </ul>
              <TrbButton className='mt-8' href='/contact'>
                {home('HousePreview.link')}
              </TrbButton>
            </div>
          </div>
        </Container>
      </section>

      <section className={`${homepageSectionLayout} bg-page-background`}>
        <Container className='w-full'>
          <div className='flex flex-col justify-between gap-8 lg:flex-row lg:items-end'>
            <SectionHeading
              eyebrow={home('GuidePreview.eyebrow')}
              title={home('GuidePreview.title')}
              body={home('GuidePreview.body')}
            />
            <TrbButton className='mt-8' href='/contact'>
              {home('GuidePreview.link')}
            </TrbButton>
          </div>
          <div className='mt-14 grid gap-12 md:grid-cols-3 md:gap-6 lg:gap-8'>
            {guideEntries.map((entry) => (
              <GuideCard
                key={entry.id}
                image={entry.image}
                alt={guide(`entries.${entry.id}.alt`)}
                category={guide(`categories.${entry.category}.label`)}
                title={guide(`entries.${entry.id}.title`)}
                description={guide(`entries.${entry.id}.description`)}
                imageFrameClassName='md:aspect-[3/4] lg:aspect-auto lg:h-[clamp(360px,45svh,520px)]'
                presentation='gallery'
              />
            ))}
          </div>
        </Container>
      </section>

      <section
        className={`${homepageSectionLayout} bg-[var(--trb-lake)] text-[var(--trb-sand)]`}
      >
        <Container className='w-full'>
          <div className='grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20'>
            <div className='relative aspect-[4/5] overflow-hidden'>
              <Image
                src='/images/property/image2-d.jpg'
                alt={home('Hospitality.imageAlt')}
                fill
                sizes='(min-width: 1024px) 40vw, 100vw'
                className='object-cover'
              />
            </div>
            <div className='max-w-2xl'>
              <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                {home('Hospitality.eyebrow')}
              </p>
              <h2 className='section-display mt-5'>
                {home('Hospitality.title')}
              </h2>
              <p className='mt-7 max-w-xl text-base leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-lg sm:leading-8'>
                {home('Hospitality.body')}
              </p>
              <TrbButton className='mt-8' href='/contact'>
                {home('Hospitality.link')}
              </TrbButton>
            </div>
          </div>
        </Container>
      </section>

      <section
        className={`${homepageSectionLayout} bg-[var(--trb-lagoon)] text-[var(--trb-sand)]`}
      >
        <Container className='w-full'>
          <div className='max-w-4xl'>
            <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_78%,transparent)]'>
              {home('FinalCta.eyebrow')}
            </p>
            <h2 className='section-display mt-5'>{home('FinalCta.title')}</h2>
            <p className='mt-7 max-w-2xl text-base leading-7 text-[color-mix(in_srgb,var(--trb-sand)_88%,transparent)] sm:text-lg sm:leading-8'>
              {home('FinalCta.body')}
            </p>
            <TrbButton className='mt-8' href='/contact'>
              {home('FinalCta.link')}
            </TrbButton>
          </div>
        </Container>
      </section>
    </>
  );
}
