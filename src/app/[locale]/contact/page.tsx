import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OwnerContactBlock } from '@/components/contact/owner-contact-block';
import { Container } from '@/components/layout/container';
import { PageIntro } from '@/components/layout/page-intro';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';
import { SectionHeading } from '@/components/ui/section-heading';
import { TrbButton } from '@/components/ui/trb-button';
import { AvailabilityEnquiry } from '@/features/accommodation/availability-enquiry';
import { isApartmentId } from '@/features/accommodation/apartments';
import { getBookingAvailability } from '@/features/accommodation/booking-availability';
import { EnquiryScrollPosition } from '@/features/contact/enquiry-scroll-position';
import {
  getPropertyImage,
  propertyImageSlots,
} from '@/features/property/property-images';
import { trbBusiness } from '@/lib/constants/business';
import { getLocalizedPageMetadata } from '@/lib/seo/localized-page-metadata';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ apartment?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getLocalizedPageMetadata(locale, 'contact');
}

export default async function ContactPage({
  params,
  searchParams,
}: ContactPageProps) {
  const { locale } = await params;
  const requestedApartment = (await searchParams).apartment;
  const initialApartment = isApartmentId(requestedApartment)
    ? requestedApartment
    : 'ground-floor';
  setRequestLocale(locale);

  const t = await getTranslations('Contact');
  const imageAlts = await getTranslations('PropertyImages');
  const availability = await getBookingAvailability();

  const introductionImage = getPropertyImage(propertyImageSlots.contactIntro);
  const welcomeImage = getPropertyImage(propertyImageSlots.contactWelcome);

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        titleLinesFromDesktop
        body={t('hero.body')}
        image={introductionImage.src}
        imagePosition={introductionImage.focalPoint}
        alt={imageAlts(introductionImage.altKey)}
        titleRole='editorial'
      />

      <section className='flex min-h-[100svh] items-center bg-[var(--trb-lake)] py-[var(--space-section)] text-[var(--trb-sand)]'>
        <Container>
          <div className='grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20'>
            <div className='relative aspect-[4/5] w-full max-w-[34rem] overflow-hidden md:max-lg:justify-self-center xl:max-w-[38rem] 2xl:max-w-[44rem]'>
              <Image
                src={welcomeImage.src}
                alt={imageAlts(welcomeImage.altKey)}
                fill
                sizes='(min-width: 1536px) 704px, (min-width: 1280px) 608px, (min-width: 1024px) 544px, calc(100vw - 2rem)'
                className='object-cover'
                style={{ objectPosition: welcomeImage.focalPoint }}
              />
            </div>

            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                {t('hospitality.eyebrow')}
              </p>

              <h2 className='editorial-statement mt-5'>
                <span className='lg:block'>
                  {t('hospitality.titleLineOne')}{' '}
                </span>
                <span className='lg:block'>
                  {t('hospitality.titleLineTwo')}
                </span>
              </h2>

              <p className='mt-7 max-w-xl text-[1.1875rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-[1.25rem] sm:leading-8'>
                {t('hospitality.body')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section
        id='enquiry'
        className='relative min-h-[100svh] scroll-mt-28 overflow-hidden bg-page-surface pb-[clamp(3.5rem,6svh,4.5rem)] pt-[clamp(6.5rem,11svh,7.5rem)] lg:flex lg:items-center'
      >
        <EditorialWatermark variant='upper-right' opacity={0.025} />
        <EnquiryScrollPosition />

        <Container className='relative z-10' data-enquiry-content>
          <div className='grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20'>
            <div className='contact-enquiry-heading min-w-0'>
              <SectionHeading
                eyebrow={t('enquiry.eyebrow')}
                title={t('enquiry.title')}
                titleLines={[
                  t('enquiry.titleLineOne'),
                  t('enquiry.titleLineTwo'),
                ]}
                titleRole='editorial'
                body={t('enquiry.body')}
              />
            </div>
          </div>

          <AvailabilityEnquiry
            data={availability}
            initialApartment={initialApartment}
            locale={locale}
          />
        </Container>
      </section>

      <section className='flex min-h-[100svh] items-center bg-page-background py-[var(--space-section)]'>
        <Container>
          <div className='grid items-start gap-14 lg:grid-cols-2 lg:gap-20'>
            <div>
              <SectionHeading
                eyebrow={t('details.eyebrow')}
                title={t('details.title')}
                body={t('details.body')}
              />

              <dl className='mt-10 divide-y divide-page-border border-y border-page-border'>
                <div className='py-5'>
                  <dt className='text-sm text-page-muted'>
                    {t('details.addressLabel')}
                  </dt>

                  <dd className='mt-2 text-page-text'>
                    <a
                      href={trbBusiness.links.maps}
                      target='_blank'
                      rel='noreferrer'
                      className='transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus'
                    >
                      {trbBusiness.address.displayLines.map((line) => (
                        <span key={line} className='block'>
                          {line}
                        </span>
                      ))}
                    </a>
                  </dd>
                </div>

                <div className='py-5'>
                  <dt className='sr-only'>{t('details.contactLabel')}</dt>
                  <dd>
                    <OwnerContactBlock
                      label={t('details.contactLabel')}
                      qrLabel={t('details.qrLabel')}
                      saveContactLabel={t('details.saveContact')}
                      whatsappLabel={t('details.whatsappLabel')}
                    />
                  </dd>
                </div>
              </dl>
            </div>

            <div className='flex w-full max-w-[36rem] flex-col lg:mt-14 lg:max-w-[30rem] lg:justify-self-end'>
              <div className='relative aspect-square w-full overflow-hidden'>
                <Image
                  src='/images/destination/trb-location-map.webp'
                  alt={`${trbBusiness.name} — ${trbBusiness.address.displayLines.join(', ')}`}
                  fill
                  sizes='(min-width: 1024px) 408px, min(472px, 100vw)'
                  className='object-cover'
                />

                <span
                  aria-hidden='true'
                  className='pointer-events-none absolute left-[49.55%] top-[51.27%] flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--trb-sand)] bg-[var(--trb-lagoon)] shadow-sm'
                >
                  <span className='size-2 rounded-full bg-[var(--trb-sand)]' />
                </span>
              </div>

              <TrbButton
                href={trbBusiness.links.maps}
                external
                className='mt-7 self-start'
              >
                {t('location.mapsLink')}
              </TrbButton>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
