import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { EditorialLink } from '@/components/ui/editorial-link';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';
import { TrbButton } from '@/components/ui/trb-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { GuideCard } from '@/features/local-guide/guide-card';
import { getHomepageGuideEntries } from '@/features/local-guide/placeholder-data';
import {
  getPropertyImage,
  propertyImageSlots,
} from '@/features/property/property-images';

const propertyFacts = [
  'lakeView',
  'privateBeach',
  'parking',
  'equipped',
] as const;

const homepageSectionLayout =
  'flex min-h-[100svh] items-center py-[var(--space-section)]';

export async function HomepageDiscovery() {
  const [home, guide, imageAlts] = await Promise.all([
    getTranslations('Home'),
    getTranslations('Guide'),
    getTranslations('PropertyImages'),
  ]);
  const guideEntries = getHomepageGuideEntries();
  const accommodationImage = getPropertyImage(
    propertyImageSlots.homeAccommodation,
  );
  const hospitalityImage = getPropertyImage(propertyImageSlots.homeHospitality);

  return (
    <>
      <section
        className={`${homepageSectionLayout} relative overflow-hidden bg-page-surface`}
      >
        <EditorialWatermark variant='upper-right' />
        <Container className='relative z-10 w-full'>
          <SectionHeading
            eyebrow={home('Apartments.eyebrow')}
            title={home('Apartments.title')}
            body={home('Apartments.body')}
          />
          <div className='mt-14 grid gap-8 lg:grid-cols-2'>
            <article className='bg-page-background'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={accommodationImage.src}
                  alt={imageAlts(accommodationImage.altKey)}
                  fill
                  sizes='(min-width: 1024px) 38rem, calc(100vw - 2rem)'
                  className='object-cover'
                  style={{ objectPosition: accommodationImage.focalPoint }}
                />
              </div>
              <div className='p-[clamp(1.5rem,4vw,3rem)]'>
                <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
                  {home('Apartments.groundFloor.eyebrow')}
                </p>
                <h3 className='mt-4 font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-none text-page-text-strong'>
                  {home('Apartments.groundFloor.title')}
                </h3>
                <p className='mt-5 max-w-xl text-[1.1875rem] leading-7 text-page-muted sm:text-[1.25rem] sm:leading-8'>
                  {home('Apartments.groundFloor.body')}
                </p>
                <ul className='mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-page-border py-5 text-sm text-page-text'>
                  {propertyFacts.map((fact) => (
                    <li key={fact}>{home(`HousePreview.facts.${fact}`)}</li>
                  ))}
                </ul>
                <EditorialLink className='mt-6' href='/house'>
                  {home('Apartments.groundFloor.link')}
                </EditorialLink>
              </div>
            </article>

            <article className='trb-editorial-glass relative flex min-h-[28rem] overflow-hidden p-[clamp(1.5rem,4vw,3rem)]'>
              <EditorialWatermark variant='lower-right' opacity={0.035} />
              <div className='relative z-10 mt-auto max-w-xl'>
                <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
                  {home('Apartments.upperFloor.eyebrow')}
                </p>
                <h3 className='mt-4 font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-none text-page-text-strong'>
                  {home('Apartments.upperFloor.title')}
                </h3>
                <p className='mt-5 text-[1.1875rem] leading-7 text-page-muted sm:text-[1.25rem] sm:leading-8'>
                  {home('Apartments.upperFloor.body')}
                </p>
                <EditorialLink
                  className='mt-6'
                  href='/apartments/upper-floor'
                >
                  {home('Apartments.upperFloor.link')}
                </EditorialLink>
              </div>
            </article>
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
            <TrbButton className='mt-8' href='/guide'>
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
                imageFrameClassName='aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-[clamp(360px,45svh,520px)]'
                imagePosition={entry.imagePosition}
                imageSizes='(min-width: 1024px) 25vw, (min-width: 768px) 31vw, calc(100vw - 2rem)'
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
                src={hospitalityImage.src}
                alt={imageAlts(hospitalityImage.altKey)}
                fill
                sizes='(min-width: 1024px) 31vw, calc(100vw - 2rem)'
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
              <p className='mt-7 max-w-xl text-[1.1875rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-[1.25rem] sm:leading-8'>
                {home('Hospitality.body')}
              </p>
              <TrbButton className='mt-8' href='/contact#enquiry'>
                {home('Hospitality.link')}
              </TrbButton>
            </div>
          </div>
        </Container>
      </section>

      <section
        className={`${homepageSectionLayout} relative overflow-hidden bg-[var(--trb-lagoon)] text-[var(--trb-sand)]`}
      >
        <EditorialWatermark
          tone='inverse'
          variant='lower-right'
          opacity={0.05}
        />
        <Container className='relative z-10 w-full'>
          <div className='max-w-4xl'>
            <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_78%,transparent)]'>
              {home('FinalCta.eyebrow')}
            </p>
            <h2 className='section-display mt-5'>{home('FinalCta.title')}</h2>
            <p className='mt-7 max-w-2xl text-[1.1875rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_88%,transparent)] sm:text-[1.25rem] sm:leading-8'>
              {home('FinalCta.body')}
            </p>
            <TrbButton className='mt-8' href='/contact#enquiry'>
              {home('FinalCta.link')}
            </TrbButton>
          </div>
        </Container>
      </section>
    </>
  );
}
