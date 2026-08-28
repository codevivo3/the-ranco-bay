import Image from "next/image";

import {Container} from "@/components/layout/container";
import {SCENE_IMAGES} from "@/components/sections/cinematic-hero/cinematic-hero.config";

type PromiseSceneProps = {
  alt: string;
  metadata: string;
  title: string;
};

export function PromiseScene({alt, metadata, title}: PromiseSceneProps) {
  return (
    <div
      data-cinematic-scene
      className="absolute inset-0 overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:!opacity-100 motion-reduce:!transform-none"
      style={{zIndex: 1}}
    >
      <div
        data-cinematic-print
        className="absolute inset-0 overflow-hidden bg-[var(--trb-sand)]"
      >
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute -inset-[3svh]">
            <Image
              data-cinematic-image
              data-drift={SCENE_IMAGES.promise.drift}
              src={SCENE_IMAGES.promise.src}
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              style={{transform: "scale(1)"}}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,18,0.14)_0%,rgba(5,12,18,0.16)_42%,rgba(5,12,18,0.76)_100%)]" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-end">
        <Container className="pb-[clamp(3rem,9svh,7rem)]">
          <div data-cinematic-copy data-scene="0" className="w-full">
            <h1
              id="cinematic-hero-title"
              className="hero-display text-[var(--trb-sand)]"
            >
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-[clamp(0.85rem,1vw,1.1rem)] uppercase leading-6 tracking-[0.1em] text-[var(--trb-sand)]/85 sm:mt-7">
              {metadata}
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
