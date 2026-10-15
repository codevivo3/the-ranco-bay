import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { TrbButton } from '@/components/ui/trb-button';
import {
  getPropertyImage,
  propertyImageSlots,
} from '@/features/property/property-images';

export async function StaticHomeHero() {
  const [home, imageAlts] = await Promise.all([
    getTranslations('Home'),
    getTranslations('PropertyImages'),
  ]);
  const heroImage = getPropertyImage(propertyImageSlots.homeHero);

  return (
    <section className='relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--trb-lake)] text-[var(--trb-sand)]'>
      <Image
        src={heroImage.src}
        alt={imageAlts(heroImage.altKey)}
        fill
        priority
        sizes='100vw'
        className='object-cover'
        style={{ objectPosition: heroImage.focalPoint }}
      />
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-[linear-gradient(180deg,rgba(23,54,84,0.12)_20%,rgba(23,54,84,0.72)_100%)]'
      />
      <Container className='relative z-10 pb-[clamp(4rem,10svh,7rem)] pt-40'>
        <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_82%,transparent)]'>
          {home('StaticHero.eyebrow')}
        </p>
        <h1 className='hero-display mt-5 max-w-4xl text-[var(--trb-sand)]'>
          {home('Hero.title')}
        </h1>
        <p className='mt-7 max-w-2xl text-[1.125rem] leading-7 text-[color-mix(in_srgb,var(--trb-sand)_88%,transparent)] sm:text-[1.25rem] sm:leading-8 lg:text-[1.375rem]'>
          {home('StaticHero.body')}
        </p>
        <TrbButton className='mt-8' href='/house'>
          {home('StaticHero.link')}
        </TrbButton>
      </Container>
    </section>
  );
}
