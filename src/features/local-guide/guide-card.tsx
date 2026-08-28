import Image from 'next/image';

type GuideCardProps = {
  alt: string;
  category: string;
  description: string;
  image: string;
  imageFrameClassName?: string;
  presentation?: 'gallery' | 'overlay' | 'standard';
  tags?: readonly string[];
  title: string;
};

export function GuideCard({
  alt,
  category,
  description,
  image,
  imageFrameClassName = '',
  presentation = 'standard',
  tags = [],
  title,
}: GuideCardProps) {
  const gallery = presentation === 'gallery';
  const overlay = presentation === 'overlay' || gallery;

  return (
    <article className={`group ${gallery ? 'h-full w-full' : ''}`}>
      <div
        className={`${gallery ? 'h-full' : 'aspect-[4/5]'} relative overflow-hidden bg-page-surface ${imageFrameClassName}`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={
            gallery
              ? '(min-width: 1024px) 60vw, 100vw'
              : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
          }
          className='object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none'
        />

        {overlay ? (
          <div className='absolute inset-x-0 bottom-0 z-10 border-t border-[color-mix(in_srgb,var(--trb-sand)_18%,transparent)] bg-[color-mix(in_srgb,var(--trb-lagoon)_52%,color-mix(in_srgb,var(--trb-sand)_18%,transparent))] px-5 py-5 text-[var(--trb-sand)] backdrop-blur-[14px] backdrop-saturate-[1.15] md:px-3 md:py-3 lg:px-6 lg:py-5'>
            <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_78%,transparent)]'>
              {category}
            </p>

            <h3 className='mt-2 font-display text-2xl leading-tight md:text-xl lg:text-3xl'>
              {title}
            </h3>

            <p className='mt-3 line-clamp-3 text-sm leading-5 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] md:mt-2 md:text-[0.8125rem] md:leading-[1.125rem] lg:mt-3 lg:text-sm lg:leading-5'>
              {description}
            </p>

            {gallery && tags.length > 0 ? (
              <ul className='mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[color-mix(in_srgb,var(--trb-sand)_76%,transparent)]'>
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {!overlay ? (
        <>
          <p className='mt-6 text-xs uppercase tracking-[0.18em] text-page-muted'>
            {category}
          </p>

          <h3 className='mt-3 font-display text-3xl leading-tight text-page-text-strong'>
            {title}
          </h3>

          <p className='mt-4 text-sm leading-6 text-page-muted'>
            {description}
          </p>

          {tags.length > 0 ? (
            <ul className='mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-page-muted'>
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
