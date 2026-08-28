import Image from "next/image";

import {Container} from "@/components/layout/container";
import {
  BAREFOOT_HIDDEN_TRANSFORM,
  SCENE_IMAGES,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";

type PrivateBeachSceneProps = {
  alt: string;
  eyebrow: string;
  lineOne: string;
  lineTwo: string;
};

export function PrivateBeachScene({
  alt,
  eyebrow,
  lineOne,
  lineTwo,
}: PrivateBeachSceneProps) {
  return (
    <div
      data-cinematic-scene
      className="absolute inset-0 overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:!opacity-100 motion-reduce:!transform-none"
      style={{zIndex: 4, opacity: 0, transform: "translate3d(0, 5.5svh, 0)"}}
    >
      <div className="absolute -inset-[3svh]">
        <Image
          data-cinematic-image
          data-drift={SCENE_IMAGES.privateBeach.drift}
          src={SCENE_IMAGES.privateBeach.src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{transform: "scale(1.01)"}}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,23,0.62)_0%,rgba(5,18,23,0.18)_58%,rgba(5,18,23,0.08)_100%)]" />
      <Container className="absolute inset-x-0 bottom-[10svh] z-10">
        <div
          data-cinematic-copy
          data-scene="3"
          className="motion-reduce:!opacity-100 motion-reduce:!transform-none"
          style={{opacity: 0, transform: "translate3d(0, 4svh, 0)"}}
        >
          <p className="mb-5 text-[clamp(0.85rem,1vw,1.1rem)] uppercase tracking-[0.18em] text-[var(--trb-sand)]/85">
            {eyebrow}
          </p>
          <p className="font-display text-[clamp(4.5rem,8vw,8.5rem)] uppercase leading-[0.82] tracking-[-0.035em] text-[var(--trb-sand)]">
            <span className="block">{lineOne}</span>
            <span className="block overflow-hidden">
              <span
                data-cinematic-beach-line-two
                className="block motion-reduce:!opacity-100 motion-reduce:!transform-none"
                style={{opacity: 0, transform: BAREFOOT_HIDDEN_TRANSFORM}}
              >
                {lineTwo}
              </span>
            </span>
          </p>
        </div>
      </Container>
    </div>
  );
}
