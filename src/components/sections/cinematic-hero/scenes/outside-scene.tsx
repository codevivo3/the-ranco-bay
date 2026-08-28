import Image from "next/image";

import {Container} from "@/components/layout/container";
import {SCENE_IMAGES} from "@/components/sections/cinematic-hero/cinematic-hero.config";

type OutsideSceneProps = {alt: string; label: string};

export function OutsideScene({alt, label}: OutsideSceneProps) {
  return (
    <div
      data-cinematic-scene
      className="absolute inset-0 overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:!opacity-100 motion-reduce:!transform-none"
      style={{zIndex: 3, opacity: 0, transform: "translate3d(0, 6svh, 0)"}}
    >
      <div className="absolute -inset-[3svh]">
        <Image
          data-cinematic-image
          data-drift={SCENE_IMAGES.outside.drift}
          src={SCENE_IMAGES.outside.src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{transform: "scale(1.01)"}}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,13,20,0.08)_0%,rgba(4,13,20,0.12)_55%,rgba(4,13,20,0.52)_100%)]" />
      <Container className="absolute inset-x-0 bottom-[8svh] z-10">
        <p
          data-cinematic-copy
          data-scene="2"
          className="hero-display max-w-lg text-[var(--trb-sand)] [--hero-display-leading:0.92] [--hero-display-size:clamp(3.5rem,6vw,6.5rem)] [--hero-display-tracking:-0.025em] motion-reduce:!opacity-100 motion-reduce:!transform-none"
          style={{opacity: 0, transform: "translate3d(0, 4svh, 0)"}}
        >
          {label}
        </p>
      </Container>
    </div>
  );
}
