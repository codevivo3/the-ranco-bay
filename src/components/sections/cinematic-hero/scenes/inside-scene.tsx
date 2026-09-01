import Image from 'next/image';

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

      <div className='absolute inset-x-4 top-[12svh] z-10 h-[54svh] overflow-hidden sm:left-[4vw] sm:right-auto sm:top-[14svh] sm:h-[68svh] sm:w-[62vw]'>
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

      <div className='absolute right-4 top-[9svh] z-20 h-[23svh] w-[42vw] overflow-hidden sm:right-[4vw] sm:top-[10svh] sm:h-[34svh] sm:w-[27vw]'>
        <Image
          data-cinematic-image
          data-drift={SCENE_IMAGES.inside[1].drift}
          src={SCENE_IMAGES.inside[1].src}
          alt={alts[1]}
          fill
          sizes='(min-width: 640px) 27vw, 42vw'
          className='object-cover object-center'
          style={{ transform: 'scale(1.01)' }}
        />
      </div>

      <div className='absolute bottom-[8svh] left-4 z-20 h-[26svh] w-[49vw] overflow-hidden sm:bottom-[7svh] sm:left-auto sm:right-[9vw] sm:h-[34svh] sm:w-[33vw]'>
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

      <div className='absolute bottom-[12svh] right-4 z-30 h-[19svh] w-[37vw] overflow-hidden sm:bottom-[5svh] sm:left-[43vw] sm:right-auto sm:h-[23svh] sm:w-[20vw]'>
        <div
          data-cinematic-image
          data-drift={SCENE_IMAGES.inside[3].drift}
          className='absolute inset-x-0 bottom-[-2.5svh] top-0'
          style={{ transform: 'scale(1.01)' }}
        >
          <Image
            src={SCENE_IMAGES.inside[3].src}
            alt={alts[3]}
            fill
            sizes='(min-width: 640px) 20vw, 37vw'
            className='object-cover object-center'
          />
        </div>
      </div>

      <div
        data-cinematic-copy
        data-scene='1'
        className='absolute bottom-3 left-4 z-40 text-[var(--trb-sand)] motion-reduce:!opacity-100 motion-reduce:!transform-none sm:bottom-8 sm:left-[4vw]'
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
  );
}
