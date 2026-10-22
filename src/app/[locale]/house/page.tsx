import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Parasol,
  Shapes,
  SquareParking,
  WavesHorizontal,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { ExpandableGalleryGroup } from '@/components/layout/expandable-gallery-group';
import { ExpandableGalleryItem } from '@/components/layout/expandable-gallery-item';
import {
  HorizontalEditorialGallery,
  HorizontalEditorialPanel,
} from '@/components/layout/horizontal-editorial-gallery';
import { PageIntro } from '@/components/layout/page-intro';
import {
  HouseChapterImage,
  HouseChapterText,
} from '@/components/sections/house-chapter';
import { EditorialLink } from '@/components/ui/editorial-link';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';
import { SectionHeading } from '@/components/ui/section-heading';
import {
  getPropertyImage,
  houseGallerySlots,
  propertyImageSlots,
  type PropertyGalleryFormat,
  type PropertyImageId,
} from '@/features/property/property-images';
import { getLocalizedPageMetadata } from '@/lib/seo/localized-page-metadata';

type HousePageProps = {
  params: Promise<{ locale: string }>;
};

type HouseGalleryItem = {
  altKey?: string;
  focalPoint?: string;
  format: PropertyGalleryFormat;
  id: string;
  src: string;
};

function propertyGalleryItem(
  imageId: PropertyImageId,
  format: PropertyGalleryFormat,
): HouseGalleryItem {
  const image = getPropertyImage(imageId);

  return {
    id: imageId,
    src: image.src,
    altKey: image.altKey,
    focalPoint: image.focalPoint,
    format,
  };
}

const chapters = [
  {
    key: 'veranda',
    items: houseGallerySlots.veranda.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
  {
    key: 'living',
    items: houseGallerySlots.living.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
  {
    key: 'bedroom',
    items: houseGallerySlots.bedroom.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
  {
    key: 'details',
    items: houseGallerySlots.details.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
  {
    key: 'outside',
    items: houseGallerySlots.outside.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
  {
    key: 'beach',
    items: houseGallerySlots.beach.map((item) =>
      propertyGalleryItem(item.imageId, item.format),
    ),
  },
] as const;

const amenities = [
  { key: 'lakeView', Icon: WavesHorizontal },
  { key: 'privateBeach', Icon: Parasol },
  { key: 'parking', Icon: SquareParking },
  { key: 'equipped', Icon: Shapes },
] as const;

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
  const imageAlts = await getTranslations('PropertyImages');
  const tAccessibility = await getTranslations('Accessibility');
  const tGallery = await getTranslations('Common.Gallery');
  const introductionImage = getPropertyImage(propertyImageSlots.houseIntro);

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        body={t('hero.body')}
        image={introductionImage.src}
        imagePosition={introductionImage.focalPoint}
        alt={imageAlts(introductionImage.altKey)}
        titleRole='editorial'
      />

      <section className='house-intro-watermark relative flex min-h-[100svh] items-center overflow-hidden bg-page-surface py-[var(--space-section)]'>
        <EditorialWatermark />
        <Container className='relative z-10'>
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
          <Container className='editorial-gallery-container'>
            <div className='editorial-gallery-row editorial-gallery-row--house grid items-stretch'>
              <div
                className={`editorial-gallery-card-slot ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <HouseChapterText
                  index={String(index + 1).padStart(2, '0')}
                  title={t(`chapters.${chapter.key}.title`)}
                  body={t(`chapters.${chapter.key}.body`)}
                />
              </div>
              <ExpandableGalleryGroup
                className={`editorial-gallery-media-slot ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}
                closeLabel={tAccessibility('closeDialog')}
                previousLabel={tGallery('previousItem')}
                nextLabel={tGallery('nextItem')}
              >
                <HorizontalEditorialGallery
                  label={t(`chapters.${chapter.key}.title`)}
                  variant='house'
                >
                  {chapter.items.map((item) => {
                    const alt = item.altKey
                      ? imageAlts(item.altKey)
                      : t('chapters.outside.imageAlt');

                    return (
                      <HorizontalEditorialPanel
                        key={item.id}
                        format={item.format}
                      >
                        <ExpandableGalleryItem
                          itemId={item.id}
                          dialogLabel={t(`chapters.${chapter.key}.title`)}
                          dialogContent={
                            <div className='relative h-[min(78svh,52rem)] w-full'>
                              <Image
                                src={item.src}
                                alt={alt}
                                fill
                                sizes='90vw'
                                className='object-contain'
                              />
                            </div>
                          }
                        >
                          <HouseChapterImage
                            image={item.src}
                            alt={alt}
                            imagePosition={item.focalPoint}
                          />
                        </ExpandableGalleryItem>
                      </HorizontalEditorialPanel>
                    );
                  })}
                </HorizontalEditorialGallery>
              </ExpandableGalleryGroup>
            </div>
          </Container>
        </section>
      ))}

      <section className='relative flex min-h-[100svh] items-center overflow-hidden bg-page-surface py-[var(--space-section)]'>
        <EditorialWatermark variant='lower-left' />
        <Container className='relative z-10'>
          <SectionHeading
            eyebrow={t('amenities.eyebrow')}
            title={t('amenities.title')}
            body={t('amenities.body')}
          />
          <ul className='mt-12 grid grid-cols-1 gap-y-5 border-y border-page-border py-8 text-base text-page-text sm:grid-cols-2 lg:flex lg:items-center lg:justify-between lg:gap-6'>
            {amenities.map(({ key, Icon }) => (
              <li key={key} className='flex min-w-0 items-center gap-2.5'>
                <Icon
                  aria-hidden='true'
                  className='shrink-0 text-[#13788A]'
                  size={20}
                  strokeWidth={1.75}
                />
                <span>{t(`amenities.items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <EditorialLink className='mt-8' href='/property'>
            {t('amenities.propertyLink')}
          </EditorialLink>
        </Container>
      </section>
    </main>
  );
}
