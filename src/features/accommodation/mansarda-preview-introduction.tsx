import {Container} from '@/components/layout/container'
import type {ApartmentIntroduction} from '@/lib/sanity/types'

type MansardaPreviewIntroductionProps = {
  content: ApartmentIntroduction
  fallbackHeading: string
}

export function MansardaPreviewIntroduction({
  content,
  fallbackHeading,
}: MansardaPreviewIntroductionProps) {
  const hasHeading = content.blocks.some(({kind}) => kind === 'heading')

  return (
    <section className='bg-page-background py-[var(--space-section)]'>
      <Container>
        <div className='mx-auto max-w-3xl'>
          {!hasHeading ? <h2 className='sr-only'>{fallbackHeading}</h2> : null}
          {content.blocks.map((block) => {
            if (block.kind === 'heading') {
              return (
                <h2
                  key={block.key}
                  className='section-display mt-8 first:mt-0 text-page-text-strong'
                >
                  {block.text}
                </h2>
              )
            }

            if (block.kind === 'quote') {
              return (
                <blockquote
                  key={block.key}
                  className='mt-7 border-l-2 border-page-accent pl-6 font-display text-2xl leading-8 text-page-text-strong'
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
          })}
        </div>
      </Container>
    </section>
  )
}
