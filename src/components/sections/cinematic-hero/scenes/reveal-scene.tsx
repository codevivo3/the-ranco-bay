import Image from "next/image";

import {Container} from "@/components/layout/container";
import {
  SCENE_ENTRANCE_SVH,
  SCENE_IMAGES,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";

type RevealSceneProps = {alt: string; eyebrow: string; title: string};

export function RevealScene({alt, eyebrow, title}: RevealSceneProps) {
  return (
    <div
      data-cinematic-scene
      className="absolute inset-0 overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:!opacity-100 motion-reduce:!transform-none"
      style={{
        zIndex: 5,
        opacity: 0,
        transform: `translate3d(0, ${SCENE_ENTRANCE_SVH}svh, 0)`,
      }}
    >
      <div className="absolute -inset-[3svh]">
        <Image
          data-cinematic-image
          data-drift={SCENE_IMAGES.reveal.drift}
          src={SCENE_IMAGES.reveal.src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{transform: "scale(1.035)"}}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,16,20,0.08)_0%,rgba(5,16,20,0.1)_48%,rgba(5,16,20,0.62)_100%)]" />
      <Container className="absolute inset-x-0 bottom-[9svh] z-10">
        <div
          data-cinematic-copy
          data-scene="4"
          className="motion-reduce:!opacity-100 motion-reduce:!transform-none"
          style={{opacity: 0, transform: "translate3d(0, 4svh, 0)"}}
        >
          <p className="mb-5 text-[clamp(0.85rem,1vw,1.1rem)] uppercase tracking-[0.18em] text-[var(--trb-sand)]/85">
            {eyebrow}
          </p>
          <p className="hero-display text-[var(--trb-sand)] [--hero-display-size:clamp(4.25rem,7.2vw,7.75rem)]">
            {title}
          </p>
        </div>
      </Container>
    </div>
  );
}
