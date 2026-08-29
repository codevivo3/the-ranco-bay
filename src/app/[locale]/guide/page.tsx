import Image from "next/image";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {ExpandableGalleryGroup} from "@/components/layout/expandable-gallery-group";
import {ExpandableGalleryItem} from "@/components/layout/expandable-gallery-item";
import {
  HorizontalEditorialGallery,
  HorizontalEditorialPanel,
} from "@/components/layout/horizontal-editorial-gallery";
import {PageIntro} from "@/components/layout/page-intro";
import {
  TEMPORARY_GALLERY_TEST_SLIDES,
  TemporaryGalleryPlaceholder,
} from "@/components/layout/temporary-gallery-placeholder";
import { TrbButton } from '@/components/ui/trb-button';
import {SectionHeading} from "@/components/ui/section-heading";
import {GuideCard} from "@/features/local-guide/guide-card";
import {
  guideCategories,
  placeholderGuideEntries,
} from "@/features/local-guide/placeholder-data";
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

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        titleLinesFromDesktop
        body={t('hero.body')}
        image='/images/property/image3.png'
        alt={t('hero.imageAlt')}
        titleRole='editorial'
      />

      {guideCategories.map((category, index) => {
        const entries = placeholderGuideEntries.filter(
          (entry) => entry.category === category && entry.active,
        );

        return (
          <section
            key={category}
            className={
              index % 2 === 0
                ? 'flex min-h-[100svh] items-center bg-page-surface py-[var(--space-section)]'
                : 'flex min-h-[100svh] items-center bg-page-background py-[var(--space-section)]'
            }
          >
            <Container className='editorial-gallery-container'>
              <div className='editorial-gallery-row editorial-gallery-row--guide grid items-stretch'>
                <div className='editorial-gallery-card-slot'>
                  <div className='editorial-gallery-text-card trb-editorial-glass'>
                    <SectionHeading
                      eyebrow={t(`categories.${category}.eyebrow`)}
                      title={t(`categories.${category}.label`)}
                      body={t(`categories.${category}.description`)}
                    />
                  </div>
                </div>
                <ExpandableGalleryGroup
                  className='editorial-gallery-media-slot'
                  closeLabel={tAccessibility('closeDialog')}
                  previousLabel={tGallery('previousItem')}
                  nextLabel={tGallery('nextItem')}
                >
                  <HorizontalEditorialGallery
                    label={t(`categories.${category}.label`)}
                    variant='guide'
                  >
                    {entries.map((entry) => (
                      <HorizontalEditorialPanel
                        key={entry.id}
                        format={entry.format}
                      >
                        <ExpandableGalleryItem
                          itemId={entry.id}
                          dialogLabel={t(`entries.${entry.id}.title`)}
                          dialogContent={
                            <article className='grid w-full overflow-hidden bg-[color-mix(in_srgb,var(--trb-lake)_82%,transparent)] lg:grid-cols-[1.2fr_0.8fr]'>
                              <div className='relative h-[52svh] min-h-72 lg:h-[78svh] lg:max-h-[48rem]'>
                                <Image
                                  src={entry.image}
                                  alt={t(`entries.${entry.id}.alt`)}
                                  fill
                                  sizes='(min-width: 1024px) 60vw, 92vw'
                                  className='object-contain'
                                />
                              </div>
                              <div className='flex items-center px-[clamp(1.5rem,4vw,4rem)] py-[clamp(2rem,5vw,5rem)]'>
                                <div>
                                  <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                                    {t(`categories.${category}.label`)}
                                  </p>
                                  <h2 className='mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]'>
                                    {t(`entries.${entry.id}.title`)}
                                  </h2>
                                  <p className='mt-6 max-w-xl text-base leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)]'>
                                    {t(`entries.${entry.id}.description`)}
                                  </p>
                                  <ul className='mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                                    {entry.tags.map((tag) => (
                                      <li key={tag}>{t(`tags.${tag}`)}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </article>
                          }
                        >
                          <GuideCard
                            image={entry.image}
                            alt={t(`entries.${entry.id}.alt`)}
                            category={t(`categories.${category}.label`)}
                            title={t(`entries.${entry.id}.title`)}
                            description={t(`entries.${entry.id}.description`)}
                            tags={entry.tags.map((tag) => t(`tags.${tag}`))}
                            presentation='gallery'
                          />
                        </ExpandableGalleryItem>
                      </HorizontalEditorialPanel>
                    ))}
                    {TEMPORARY_GALLERY_TEST_SLIDES.slice(
                      0,
                      Math.max(0, 4 - entries.length),
                    ).map((slide, placeholderIndex) => (
                      <HorizontalEditorialPanel
                        key={`temporary-${slide.slideNumber}`}
                        format={slide.format}
                      >
                        <TemporaryGalleryPlaceholder
                          slideNumber={entries.length + placeholderIndex + 1}
                          tone={slide.tone}
                        />
                      </HorizontalEditorialPanel>
                    ))}
                  </HorizontalEditorialGallery>
                </ExpandableGalleryGroup>
              </div>
            </Container>
          </section>
        );
      })}

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
            <p className='mt-6 max-w-2xl text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)]'>
              {t('cta.body')}
            </p>
            <TrbButton className='mt-8' href='/contact'>
              {t('cta.link')}
            </TrbButton>
          </div>
        </Container>
      </section>
    </main>
  );
}
