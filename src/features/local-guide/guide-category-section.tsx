import {Container} from '@/components/layout/container'
import {ExpandableGalleryGroup} from '@/components/layout/expandable-gallery-group'
import {ExpandableGalleryItem} from '@/components/layout/expandable-gallery-item'
import {
  HorizontalEditorialGallery,
  HorizontalEditorialPanel,
} from '@/components/layout/horizontal-editorial-gallery'
import {SectionHeading} from '@/components/ui/section-heading'

import {GuideCard} from './guide-card'
import {
  GuidePhotographyCarousel,
  type GuideCarouselLabels,
} from './guide-photography-carousel'
import {
  GuidePracticalInformation,
  type GuidePracticalLabels,
} from './guide-practical-information'
import type {LocalGuideEntry} from './types'

type GuideCategorySectionProps = {
  closeLabel: string
  carouselLabels: GuideCarouselLabels
  description: string
  entries: readonly LocalGuideEntry[]
  emptyState: string
  eyebrow: string
  index: number
  label: string
  nextLabel: string
  practicalLabels: GuidePracticalLabels
  previousLabel: string
}

export function GuideCategorySection({
  closeLabel,
  carouselLabels,
  description,
  entries,
  emptyState,
  eyebrow,
  index,
  label,
  nextLabel,
  practicalLabels,
  previousLabel,
}: GuideCategorySectionProps) {
  return (
    <section
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
                eyebrow={eyebrow}
                title={label}
                body={description}
              />
            </div>
          </div>
          {entries.length > 0 ? (
            <ExpandableGalleryGroup
              className='editorial-gallery-media-slot'
              closeLabel={closeLabel}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
            >
              <HorizontalEditorialGallery label={label} variant='guide'>
              {entries.map((entry) => (
                <HorizontalEditorialPanel key={entry.id} format={entry.format}>
                  <ExpandableGalleryItem
                    itemId={entry.id}
                    dialogLabel={entry.title}
                    dialogContent={
                      <article
                        className={`grid w-full overflow-hidden bg-[color-mix(in_srgb,var(--trb-lake)_82%,transparent)] ${
                          entry.photography.length > 0
                            ? 'lg:grid-cols-[1.2fr_0.8fr]'
                            : ''
                        }`}
                      >
                        {entry.photography.length > 0 ? (
                          <GuidePhotographyCarousel
                            key={entry.id}
                            label={entry.title}
                            labels={carouselLabels}
                            photographs={entry.photography}
                          />
                        ) : null}
                        <div className='flex items-center px-[clamp(1.5rem,4vw,4rem)] py-[clamp(2rem,5vw,5rem)]'>
                          <div>
                            <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                              {label}
                            </p>
                            <h2 className='mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] [overflow-wrap:anywhere]'>
                              {entry.title}
                            </h2>
                            {entry.subtitle ? (
                              <p className='mt-4 max-w-xl text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-7 text-[color-mix(in_srgb,var(--trb-sand)_85%,transparent)] [overflow-wrap:anywhere]'>
                                {entry.subtitle}
                              </p>
                            ) : null}
                            {entry.description ? (
                              <p className='mt-6 max-w-xl whitespace-pre-line text-[1.125rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-[1.25rem] sm:leading-8'>
                                {entry.description}
                              </p>
                            ) : null}
                            {entry.seasonalInformation ? (
                              <p className='mt-5 max-w-xl whitespace-pre-line text-sm leading-6 text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                                {entry.seasonalInformation}
                              </p>
                            ) : null}
                            <GuidePracticalInformation
                              entry={entry}
                              labels={practicalLabels}
                            />
                            {entry.tags.length > 0 ? (
                              <ul className='mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                                {entry.tags.map((tag) => (
                                  <li key={tag}>{tag}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    }
                  >
                    <GuideCard
                      image={entry.image}
                      alt={entry.imageAlt}
                      category={label}
                      title={entry.title}
                      subtitle={entry.subtitle}
                      description={entry.description}
                      imagePosition={entry.imagePosition}
                      tags={entry.tags}
                      presentation='gallery'
                    />
                  </ExpandableGalleryItem>
                </HorizontalEditorialPanel>
              ))}
              </HorizontalEditorialGallery>
            </ExpandableGalleryGroup>
          ) : (
            <div className='editorial-gallery-media-slot'>
              <div className='trb-editorial-glass flex h-[var(--editorial-card-height)] items-center justify-center px-[clamp(1.5rem,4vw,3rem)] text-center'>
                <p className='max-w-sm text-base leading-7 text-page-muted'>
                  {emptyState}
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
