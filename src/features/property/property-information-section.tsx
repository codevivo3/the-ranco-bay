import Image from 'next/image'
import type {ReactNode} from 'react'

import {Container} from '@/components/layout/container'
import {TrbButton} from '@/components/ui/trb-button'
import type {
  EditorialTextBlock,
  LocalizedEditorialSection,
  PropertyPhotograph,
} from '@/lib/sanity/types'

type PropertyInformationSectionProps = {
  children?: ReactNode
  fallbackEyebrow: string
  fallbackTitle: string
  link?: {
    href: '/contact' | '/guide' | '/house'
    label: string
  }
  reverse?: boolean
  section: LocalizedEditorialSection
  surface?: 'background' | 'surface'
}

function EditorialBlocks({blocks}: {blocks: EditorialTextBlock[]}) {
  return blocks.map((block) => {
    if (block.kind === 'heading') {
      return (
        <h3
          key={block.key}
          className='mt-8 font-display text-2xl leading-tight text-page-text-strong first:mt-0 sm:text-3xl'
        >
          {block.text}
        </h3>
      )
    }

    if (block.kind === 'quote') {
      return (
        <blockquote
          key={block.key}
          className='mt-7 border-l-2 border-page-accent pl-6 font-display text-2xl leading-8 text-page-text-strong first:mt-0'
        >
          {block.text}
        </blockquote>
      )
    }

    return (
      <p
        key={block.key}
        className='mt-6 text-[1.125rem] leading-8 text-page-muted first:mt-0'
      >
        {block.text}
      </p>
    )
  })
}

export function PropertyInformationSection({
  children,
  fallbackEyebrow,
  fallbackTitle,
  link,
  reverse = false,
  section,
  surface = 'background',
}: PropertyInformationSectionProps) {
  return (
    <section
      className={`flex min-h-[100svh] items-center ${surface === 'surface' ? 'bg-page-surface' : 'bg-page-background'} py-[var(--space-section)]`}
    >
      <Container>
        <div
          className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-20 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
        >
          <div>
            <p className='text-xs uppercase tracking-[0.18em] text-page-muted'>
              {section.eyebrow ?? fallbackEyebrow}
            </p>
            <h2 className='section-display mt-5 text-page-text-strong'>
              {section.heading ?? fallbackTitle}
            </h2>

            {section.body.length > 0 ? (
              <div className='mt-7 max-w-2xl'>
                <EditorialBlocks blocks={section.body} />
              </div>
            ) : null}

            {children ? <div className='mt-10'>{children}</div> : null}

            {link ? (
              <TrbButton className='mt-9' href={link.href}>
                {link.label}
              </TrbButton>
            ) : null}
          </div>

          {section.image ? (
            <div className='relative aspect-[4/3] w-full overflow-hidden'>
              <Image
                src={section.image.src}
                alt={section.image.alt}
                fill
                sizes='(min-width: 1024px) 46vw, calc(100vw - 2rem)'
                className='object-cover'
              />
            </div>
          ) : (
            <div aria-hidden='true' className='hidden lg:block' />
          )}
        </div>
      </Container>
    </section>
  )
}

type PropertyPhotographyProps = {
  eyebrow: string
  photographs: PropertyPhotograph[]
  title: string
  withTopSpacing?: boolean
}

export function PropertyPhotography({
  eyebrow,
  photographs,
  title,
  withTopSpacing = true,
}: PropertyPhotographyProps) {
  if (photographs.length === 0) return null

  return (
    <section
      className={`bg-page-background pb-[var(--space-section)] ${withTopSpacing ? 'pt-[var(--space-section)]' : ''}`}
    >
      <Container>
        <p className='text-xs uppercase tracking-[0.18em] text-page-muted'>
          {eyebrow}
        </p>
        <h2 className='section-display mt-5 text-page-text-strong'>{title}</h2>
        <div className='mt-10 grid items-start gap-6 md:grid-cols-2'>
          {photographs.map((photograph) => (
            <Image
              key={photograph.id}
              src={photograph.src}
              alt={photograph.alt}
              width={photograph.width ?? 1800}
              height={photograph.height ?? 1200}
              sizes='(min-width: 768px) 48vw, calc(100vw - 2rem)'
              className='h-auto w-full'
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
