import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { ExpandableGalleryItem } from '@/components/layout/expandable-gallery-item';
import {
  HorizontalEditorialGallery,
  HorizontalEditorialPanel,
} from '@/components/layout/horizontal-editorial-gallery';
import { PageIntro } from '@/components/layout/page-intro';
import {
  TEMPORARY_GALLERY_TEST_SLIDES,
  TemporaryGalleryPlaceholder,
} from '@/components/layout/temporary-gallery-placeholder';
import {
  HouseChapterImage,
  HouseChapterText,
} from '@/components/sections/house-chapter';
import { TrbButton } from '@/components/ui/trb-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { getLocalizedPageMetadata } from '@/lib/seo/localized-page-metadata';

type HousePageProps = {
  params: Promise<{ locale: string }>;
};

const chapters = [
  { key: 'veranda', image: '/images/property/image1.jpg' },
  { key: 'living', image: '/images/property/image2-a.jpg' },
  { key: 'bedroom', image: '/images/property/image2-c.jpg' },
  { key: 'details', image: '/images/property/image2-d.jpg' },
  { key: 'outside', image: '/images/property/image3.png' },
  { key: 'beach', image: '/images/property/image4.jpg' },
] as const;

const amenityKeys = [
  'lakeView',
  'privateBeach',
  'parking',
  'equipped',
] as const;

const practicalKeys = ['setting', 'arrival', 'parking', 'beach'] as const;

export async function generateMetadata({
  params,
}: HousePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getLocalizedPageMetadata(locale, 'house');
}

export default async function HousePage({ params }: HousePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('House');
  const tAccessibility = await getTranslations('Accessibility');

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        body={t('hero.body')}
        image='/images/property/image5.jpg'
        alt={t('hero.imageAlt')}
        titleRole='editorial'
      />

      <section className='flex min-h-[100svh] items-center bg-page-surface py-[var(--space-section)]'>
        <Container>
          <SectionHeading
            eyebrow={t('introduction.eyebrow')}
            title={t('introduction.title')}
            body={t('introduction.body')}
          />
        </Container>
      </section>

      {chapters.map((chapter, index) => (
        <section
          key={chapter.key}
          className='bg-page-background py-[var(--space-section)]'
        >
          <Container className='!max-w-[110rem]'>
            <div
              className={`editorial-gallery-row grid items-stretch gap-10 lg:gap-16 ${index % 2 === 1 ? 'lg:grid-cols-[0.62fr_0.38fr]' : 'lg:grid-cols-[0.38fr_0.62fr]'}`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <HouseChapterText
                  index={String(index + 1).padStart(2, '0')}
                  title={t(`chapters.${chapter.key}.title`)}
                  body={t(`chapters.${chapter.key}.body`)}
                />
              </div>
              <HorizontalEditorialGallery
                label={t(`chapters.${chapter.key}.title`)}
                variant='house'
              >
                <HorizontalEditorialPanel format='landscape'>
                  <ExpandableGalleryItem
                    closeLabel={tAccessibility('closeDialog')}
                    dialogLabel={t(`chapters.${chapter.key}.title`)}
                    dialogContent={
                      <div className='relative h-[82svh] w-[min(90vw,90rem)]'>
                        <Image
                          src={chapter.image}
                          alt={t(`chapters.${chapter.key}.imageAlt`)}
                          fill
                          sizes='90vw'
                          className='object-contain'
                        />
                      </div>
                    }
                  >
                    <HouseChapterImage
                      image={chapter.image}
                      alt={t(`chapters.${chapter.key}.imageAlt`)}
                    />
                  </ExpandableGalleryItem>
                </HorizontalEditorialPanel>
                {TEMPORARY_GALLERY_TEST_SLIDES.map((slide) => (
                  <HorizontalEditorialPanel
                    key={slide.slideNumber}
                    format={slide.format}
                  >
                    <TemporaryGalleryPlaceholder
                      slideNumber={slide.slideNumber}
                      tone={slide.tone}
                    />
                  </HorizontalEditorialPanel>
                ))}
              </HorizontalEditorialGallery>
            </div>
          </Container>
        </section>
      ))}

      <section className='flex min-h-[100svh] items-center bg-page-surface py-[var(--space-section)]'>
        <Container>
          <SectionHeading
            eyebrow={t('amenities.eyebrow')}
            title={t('amenities.title')}
            body={t('amenities.body')}
          />
          <ul className='mt-12 grid gap-x-10 gap-y-5 border-y border-page-border py-8 text-base text-page-text sm:grid-cols-2 lg:grid-cols-4'>
            {amenityKeys.map((key) => (
              <li key={key}>{t(`amenities.items.${key}`)}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className='bg-page-background py-[var(--space-section)]'>
        <Container>
          <SectionHeading
            eyebrow={t('practical.eyebrow')}
            title={t('practical.title')}
            body={t('practical.body')}
          />
          <dl className='mt-12 divide-y divide-page-border border-y border-page-border'>
            {practicalKeys.map((key) => (
              <div
                key={key}
                className='grid gap-2 py-6 sm:grid-cols-[0.35fr_0.65fr] sm:gap-8'
              >
                <dt className='font-medium text-page-text'>
                  {t(`practical.items.${key}.label`)}
                </dt>
                <dd className='text-page-muted'>
                  {t(`practical.items.${key}.value`)}
                </dd>
              </div>
            ))}
          </dl>
          <TrbButton className='mt-10' href='/contact'>
            {t('practical.contactLink')}
          </TrbButton>
        </Container>
      </section>
    </main>
  );
}
