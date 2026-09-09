import Image from 'next/image';

import { Container } from '@/components/layout/container';
import { SCENE_IMAGES } from '@/components/sections/cinematic-hero/cinematic-hero.config';
import { EditorialWatermark } from '@/components/ui/editorial-watermark';

type InsideSceneProps = {
  alts: readonly [string, string, string, string];
  subtitle: string;
  title: string;
};

export function InsideScene({ alts, subtitle, title }: InsideSceneProps) {
  return (
    <div
      data-cinematic-scene
      className='absolute inset-0 overflow-hidden bg-[var(--trb-lagoon)] motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:!opacity-100 motion-reduce:!transform-none'
      style={{ zIndex: 2, opacity: 0, transform: 'translate3d(0, 7svh, 0)' }}
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(240,237,218,0.09),transparent_44%)]' />
      <EditorialWatermark
        tone='inverse'
        variant='upper-right'
        opacity={0.035}
      />

      <Container className='absolute inset-0'>
        <div className='relative h-full w-full'>
          <div className='absolute inset-x-0 top-[12svh] z-10 aspect-[4/3] overflow-hidden sm:right-auto sm:top-[14svh] sm:w-[62vw] lg:w-[56%]'>
            <Image
              data-cinematic-image
              data-drift={SCENE_IMAGES.inside[0].drift}
              src={SCENE_IMAGES.inside[0].src}
              alt={alts[0]}
              fill
              sizes='(min-width: 640px) 62vw, calc(100vw - 2rem)'
              className='object-cover object-center'
              style={{ transform: 'scale(1.01)' }}
            />
          </div>

          <div className='absolute right-0 top-[9svh] z-30 aspect-[3/4] w-[42vw] overflow-hidden sm:top-[10svh] sm:w-[27vw] lg:top-[31svh] lg:w-[18%]'>
            <Image
              data-cinematic-image
              data-drift={SCENE_IMAGES.inside[1].drift}
              src={SCENE_IMAGES.inside[1].src}
              alt={alts[1]}
              fill
              sizes='(min-width: 1024px) 20vw, (min-width: 640px) 27vw, 42vw'
              className='object-cover object-center lg:object-[50%_70%]'
              style={{ transform: 'scale(1.01)' }}
            />
          </div>

          <div className='absolute bottom-[24svh] left-0 z-20 aspect-[4/3] w-[49vw] overflow-hidden sm:left-auto sm:right-[5vw] sm:w-[33vw] lg:bottom-[7svh] lg:left-[54%] lg:right-auto lg:w-[30%]'>
            <div
              data-cinematic-image
              data-drift={SCENE_IMAGES.inside[2].drift}
              className='absolute inset-x-0 bottom-[-2.5svh] top-0'
              style={{ transform: 'scale(1.01)' }}
            >
              <Image
                src={SCENE_IMAGES.inside[2].src}
                alt={alts[2]}
                fill
                sizes='(min-width: 640px) 33vw, 49vw'
                className='object-cover object-center'
              />
            </div>
          </div>

          <div
            data-cinematic-copy
            data-scene='1'
            className='absolute bottom-3 left-0 z-40 text-[var(--trb-sand)] motion-reduce:!opacity-100 motion-reduce:!transform-none sm:bottom-8'
            style={{ opacity: 0, transform: 'translate3d(0, 4svh, 0)' }}
          >
            <p className='font-display text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.98]'>
              {title}
            </p>

            <p className='mt-2 text-[clamp(0.85rem,1vw,1.1rem)] font-light uppercase leading-tight tracking-[0.16em] text-[var(--trb-sand)]/80'>
              {subtitle}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
