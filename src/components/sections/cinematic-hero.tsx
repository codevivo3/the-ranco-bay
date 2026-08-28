"use client";

import {useTranslations} from "next-intl";
import {useMemo} from "react";

import {
  SCENE_COUNT,
  SCENE_IMAGES,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";
import {InsideScene} from "@/components/sections/cinematic-hero/scenes/inside-scene";
import {OutsideScene} from "@/components/sections/cinematic-hero/scenes/outside-scene";
import {PrivateBeachScene} from "@/components/sections/cinematic-hero/scenes/private-beach-scene";
import {PromiseScene} from "@/components/sections/cinematic-hero/scenes/promise-scene";
import {RevealScene} from "@/components/sections/cinematic-hero/scenes/reveal-scene";
import {useCinematicHero} from "@/components/sections/cinematic-hero/use-cinematic-hero";

export function CinematicHero() {
  const hero = useTranslations("Home.Hero");
  const t = useTranslations("Home.CinematicHero");
  const counters = useMemo(
    () =>
      Array.from({length: SCENE_COUNT}, (_, index) =>
        t("counter", {
          current: String(index + 1).padStart(2, "0"),
          total: String(SCENE_COUNT).padStart(2, "0"),
        }),
      ),
    [t],
  );
  const heroRef = useCinematicHero(counters);

  return (
    <section
      ref={heroRef}
      className="relative h-[430svh] bg-page-accent text-white motion-reduce:h-auto sm:h-[500svh] md:h-[115svh]"
      aria-labelledby="cinematic-hero-title"
    >
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
        <PromiseScene
          alt={t(SCENE_IMAGES.promise.altKey)}
          metadata={hero("metadata")}
          title={hero("title")}
        />
        <InsideScene
          alts={[
            t(SCENE_IMAGES.inside[0].altKey),
            t(SCENE_IMAGES.inside[1].altKey),
            t(SCENE_IMAGES.inside[2].altKey),
            t(SCENE_IMAGES.inside[3].altKey),
          ]}
          subtitle={t("scenes.inside.subtitle")}
          title={t("scenes.inside.title")}
        />
        <OutsideScene
          alt={t(SCENE_IMAGES.outside.altKey)}
          label={t("scenes.outside.label")}
        />
        <PrivateBeachScene
          alt={t(SCENE_IMAGES.privateBeach.altKey)}
          eyebrow={t("scenes.privateBeach.eyebrow")}
          lineOne={t("scenes.privateBeach.lineOne")}
          lineTwo={t("scenes.privateBeach.lineTwo")}
        />
        <RevealScene
          alt={t(SCENE_IMAGES.reveal.altKey)}
          eyebrow={t("scenes.reveal.eyebrow")}
          title={t("scenes.reveal.title")}
        />
        <p
          data-cinematic-counter
          className="absolute right-5 top-6 z-50 text-xs tabular-nums tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] motion-reduce:hidden sm:right-[4vw] sm:top-8"
          aria-live="off"
        >
          {counters[0]}
        </p>
      </div>
    </section>
  );
}
