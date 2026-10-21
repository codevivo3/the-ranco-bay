import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {PageIntro} from "@/components/layout/page-intro";
import { TrbButton } from '@/components/ui/trb-button';
import {GuideCategorySection} from '@/features/local-guide/guide-category-section';
import {
  guideCategories,
  placeholderGuideEntries,
} from "@/features/local-guide/placeholder-data";
import type {LocalGuideEntry} from '@/features/local-guide/types';
import type {AppLocale} from '@/i18n/routing';
import {getLocalGuideEntries} from '@/lib/sanity/local-guide';
import {getLocalizedPageMetadata} from "@/lib/seo/localized-page-metadata";

type GuidePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const {locale} = await params;
  return getLocalizedPageMetadata(locale, "guide");
}

export default async function GuidePage({params}: GuidePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Guide");
  const tAccessibility = await getTranslations("Accessibility");
  const tGallery = await getTranslations("Common.Gallery");
  const cmsResult = await getLocalGuideEntries(locale as AppLocale);
  const cmsEntries = cmsResult.status === 'success' ? cmsResult.data : [];

  const getEntries = (category: (typeof guideCategories)[number]) => {
    const categoryEntries = cmsEntries.filter(
      (entry) => entry.category === category,
    );
    if (categoryEntries.length > 0) return categoryEntries;

    return placeholderGuideEntries
      .filter((entry) => entry.category === category && entry.active)
      .map<LocalGuideEntry>((entry, index) => ({
        category,
        description: t(`entries.${entry.id}.description`),
        displayOrder: index,
        featured: entry.featured,
        format: entry.format,
        id: entry.id,
        image: entry.image,
        imageAlt: t(`entries.${entry.id}.alt`),
        imagePosition: entry.imagePosition,
        mapsUrl: entry.mapsUrl ?? undefined,
        photography: [
          {
            alt: t(`entries.${entry.id}.alt`),
            format: entry.format,
            id: `${entry.id}-photograph`,
            imagePosition: entry.imagePosition,
            src: entry.image,
          },
        ],
        tags: entry.tags.map((tag) => t(`tags.${tag}`)),
        title: t(`entries.${entry.id}.title`),
      }));
  };

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        titleLinesFromDesktop
        body={t('hero.body')}
        image='/images/cinematic/image3.png'
        alt={t('hero.imageAlt')}
        titleRole='editorial'
      />

      {guideCategories.map((category, index) => (
        <GuideCategorySection
          key={category}
          index={index}
          entries={getEntries(category)}
          eyebrow={t(`categories.${category}.eyebrow`)}
          label={t(`categories.${category}.label`)}
          description={t(`categories.${category}.description`)}
          closeLabel={tAccessibility('closeDialog')}
          previousLabel={tGallery('previousItem')}
          nextLabel={tGallery('nextItem')}
          carouselLabels={{
            image: tGallery('image'),
            next: tGallery('nextImage'),
            previous: tGallery('previousImage'),
          }}
          practicalLabels={{
            address: t('practical.address'),
            directions: t('practical.directions'),
            telephone: t('practical.telephone'),
            website: t('practical.website'),
          }}
        />
      ))}

      <section className='flex min-h-[100svh] items-center bg-[var(--trb-lake)] py-[var(--space-section)] text-[var(--trb-sand)]'>
        <Container>
          <div className='max-w-5xl'>
            <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
              {t('cta.eyebrow')}
            </p>
            <h2 className='editorial-statement mt-5'>
              <span className='lg:block'>{t('cta.titleLineOne')} </span>
              <span className='lg:block'>{t('cta.titleLineTwo')}</span>
            </h2>
            <p className='mt-6 max-w-2xl text-[1.1875rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-[1.25rem] sm:leading-8'>
              {t('cta.body')}
            </p>
            <TrbButton className='mt-8' href='/contact#enquiry'>
              {t('cta.link')}
            </TrbButton>
          </div>
        </Container>
      </section>
    </main>
  );
}
