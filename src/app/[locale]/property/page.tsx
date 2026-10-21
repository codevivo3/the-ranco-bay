import type {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'

import {OwnerContactBlock} from '@/components/contact/owner-contact-block'
import {Container} from '@/components/layout/container'
import {PageIntroFrame} from '@/components/layout/page-intro-frame'
import {EditorialWatermark} from '@/components/ui/editorial-watermark'
import {SectionHeading} from '@/components/ui/section-heading'
import {TrbButton} from '@/components/ui/trb-button'
import {
  PropertyInformationSection,
  PropertyPhotography,
} from '@/features/property/property-information-section'
import type {AppLocale} from '@/i18n/routing'
import {
  getDraftAwarePropertyInformation,
  getPublishedPropertyInformation,
  isPropertyInformationReady,
} from '@/lib/sanity/property-information'
import type {PropertyInformation} from '@/lib/sanity/types'
import {getLocalizedPageMetadata} from '@/lib/seo/localized-page-metadata'

type PropertyPageProps = {
  params: Promise<{locale: string}>
}

type PageTranslations = Awaited<ReturnType<typeof getTranslations>>

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const {locale} = await params
  const result = await getPublishedPropertyInformation(locale as AppLocale)
  const property = result.status === 'success' ? result.data : null

  return getLocalizedPageMetadata(locale, 'property', {
    description: property?.seo?.description,
    index: property ? isPropertyInformationReady(property) : false,
    socialImage: property?.seo?.socialImage
      ? {
          alt: property.seo.socialImage.alt || 'The Ranco Bay',
          height: property.seo.socialImage.height,
          url: property.seo.socialImage.src,
          width: property.seo.socialImage.width,
        }
      : undefined,
    title: property?.seo?.title,
  })
}

function PropertyIntro({t}: {t: PageTranslations}) {
  return (
    <PageIntroFrame>
      <div className='relative flex w-full self-stretch items-center overflow-hidden bg-page-surface'>
        <EditorialWatermark variant='lower-right' />
        <Container className='relative z-10 py-[var(--space-section)]'>
          <div className='max-w-5xl'>
            <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
              {t('intro.eyebrow')}
            </p>
            <h1 className='editorial-statement mt-5 text-page-text-strong'>
              {t('intro.title')}
            </h1>
            <p className='mt-7 max-w-2xl text-[1.125rem] leading-7 text-page-muted sm:text-[1.25rem] sm:leading-8 lg:text-[1.375rem]'>
              {t('intro.body')}
            </p>
          </div>
        </Container>
      </div>
    </PageIntroFrame>
  )
}

function PropertyFallback({
  contact,
  t,
}: {
  contact: PageTranslations
  t: PageTranslations
}) {
  return (
    <>
      <PropertyIntro t={t} />
      <section className='bg-page-background py-[var(--space-section)]'>
        <Container>
          <SectionHeading
            eyebrow={t('fallback.eyebrow')}
            title={t('fallback.title')}
            body={t('fallback.body')}
          />
          <div className='mt-10 max-w-3xl border-y border-page-border py-7'>
            <OwnerContactBlock
              label={contact('label')}
              qrLabel={contact('vcard')}
              saveContactLabel={contact('saveContact')}
              whatsappLabel={contact('whatsapp')}
            />
          </div>
          <TrbButton className='mt-9' href='/contact'>
            {t('fallback.contact')}
          </TrbButton>
        </Container>
      </section>
    </>
  )
}

function PropertyContent({
  contact,
  property,
  t,
}: {
  contact: PageTranslations
  property: PropertyInformation
  t: PageTranslations
}) {
  return (
    <>
      <PropertyIntro t={t} />

      {property.overview ? (
        <PropertyInformationSection
          section={property.overview}
          fallbackEyebrow={t('sections.overview.eyebrow')}
          fallbackTitle={t('sections.overview.title')}
          link={{href: '/house', label: t('links.house')}}
        />
      ) : null}

      <PropertyPhotography
        eyebrow={t('photography.eyebrow')}
        title={t('photography.title')}
        photographs={property.exteriorPhotography}
        withTopSpacing={!property.overview}
      />

      {property.arrivalAndParking ? (
        <PropertyInformationSection
          section={property.arrivalAndParking}
          fallbackEyebrow={t('sections.arrival.eyebrow')}
          fallbackTitle={t('sections.arrival.title')}
          link={{href: '/contact', label: t('links.contact')}}
          reverse
          surface='surface'
        />
      ) : null}

      {property.stayEssentials ? (
        <PropertyInformationSection
          section={property.stayEssentials}
          fallbackEyebrow={t('sections.stay.eyebrow')}
          fallbackTitle={t('sections.stay.title')}
        />
      ) : null}

      {property.assistance ? (
        <PropertyInformationSection
          section={property.assistance}
          fallbackEyebrow={t('sections.assistance.eyebrow')}
          fallbackTitle={t('sections.assistance.title')}
          link={{href: '/guide', label: t('links.guide')}}
          reverse
          surface='surface'
        >
          <div className='border-y border-page-border py-7'>
            <OwnerContactBlock
              label={contact('label')}
              qrLabel={contact('vcard')}
              saveContactLabel={contact('saveContact')}
              whatsappLabel={contact('whatsapp')}
            />
          </div>
        </PropertyInformationSection>
      ) : null}
    </>
  )
}

export default async function PropertyPage({params}: PropertyPageProps) {
  const {locale} = await params
  setRequestLocale(locale)

  const t = await getTranslations('PropertyPage')
  const contact = await getTranslations('Common.DirectContact')
  const result = await getDraftAwarePropertyInformation(locale as AppLocale)

  if (result.status === 'unavailable') {
    return (
      <main id='main-content'>
        <PropertyFallback contact={contact} t={t} />
      </main>
    )
  }

  if (result.status === 'missing') {
    return (
      <main id='main-content'>
        <PropertyFallback contact={contact} t={t} />
      </main>
    )
  }

  const property = result.data
  const hasEditorialContent =
    property.overview ||
    property.arrivalAndParking ||
    property.stayEssentials ||
    property.assistance ||
    property.exteriorPhotography.length > 0

  return (
    <main id='main-content'>
      {hasEditorialContent ? (
        <PropertyContent contact={contact} property={property} t={t} />
      ) : (
        <PropertyFallback contact={contact} t={t} />
      )}
    </main>
  )
}
