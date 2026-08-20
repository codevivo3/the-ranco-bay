"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import {useEffect, useRef} from "react";

import {Container} from "@/components/layout/container";

const slides = [
  {
    src: "/images/alessandra1barbieri-island-4873495.jpg",
    key: "arrival",
    objectPosition: "object-[68%_center] sm:object-center",
  },
  {
    src: "/images/the_iop-lake-8763490_1920.jpg",
    key: "openWater",
    objectPosition: "object-center",
  },
  {
    src: "/images/claudiof74-lake-maggiore-3190402_1920.jpg",
    key: "evening",
    objectPosition: "object-center",
  },
] as const;

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function ease(value: number) {
  return value * value * (3 - 2 * value);
}

export function CinematicHero() {
  const t = useTranslations("Home.Hero");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const scenes = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-cinematic-scene]"),
    );
    const images = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-cinematic-image]"),
    );
    const copy = hero.querySelector<HTMLElement>("[data-cinematic-copy]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame: number | null = null;

    const render = () => {
      animationFrame = null;

      if (reducedMotion.matches) {
        scenes.forEach((scene, index) => {
          scene.style.opacity = index === 0 ? "1" : "0";
          scene.style.transform = "none";
        });
        images.forEach((image) => {
          image.style.transform = "none";
        });
        if (copy) {
          copy.style.opacity = "1";
          copy.style.transform = "none";
        }
        return;
      }

      const scrollDistance = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-hero.getBoundingClientRect().top / scrollDistance);
      const sceneSpan = 1 / (scenes.length - 1);
      const compact = window.innerWidth < 640;
      const entranceY = compact ? 8 : 14;
      const imageTravel = compact ? 2.5 : 4.5;

      scenes.forEach((scene, index) => {
        if (index === 0) {
          const departure = ease(clamp(progress / sceneSpan));
          scene.style.opacity = "1";
          scene.style.transform = `translate3d(0, ${-3 * departure}svh, 0) scale(${1 + 0.012 * departure})`;
          return;
        }

        const localProgress = ease(
          clamp((progress - (index - 1) * sceneSpan) / sceneSpan),
        );
        const entranceX = !compact && index % 2 === 0 ? 3 * (1 - localProgress) : 0;

        scene.style.opacity = String(clamp(localProgress * 1.8));
        scene.style.transform = `translate3d(${entranceX}vw, ${entranceY * (1 - localProgress)}svh, 0) scale(${1.025 - 0.025 * localProgress})`;
      });

      images.forEach((image, index) => {
        const localProgress =
          index === 0
            ? ease(clamp(progress / sceneSpan))
            : ease(clamp((progress - (index - 1) * sceneSpan) / sceneSpan));

        image.style.transform = `translate3d(0, ${-imageTravel * localProgress}svh, 0) scale(${1.04 + 0.015 * localProgress})`;
      });

      if (copy) {
        copy.style.opacity = String(1 - progress * 0.08);
        copy.style.transform = `translate3d(0, ${-(compact ? 3 : 5) * progress}svh, 0)`;
      }
    };

    const requestRender = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    render();
    window.addEventListener("scroll", requestRender, {passive: true});
    window.addEventListener("resize", requestRender);
    reducedMotion.addEventListener("change", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener("change", requestRender);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[300svh] bg-page-accent text-white sm:h-[340svh] motion-reduce:h-[100svh]"
      aria-labelledby="cinematic-hero-title"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            data-cinematic-scene
            className="absolute inset-0 overflow-hidden"
            style={{
              zIndex: index + 1,
              opacity: index === 0 ? 1 : 0,
              transform:
                index === 0
                  ? "none"
                  : "translate3d(0, 14svh, 0) scale(1.025)",
            }}
          >
            <Image
              data-cinematic-image
              src={slide.src}
              alt={t(`slides.${slide.key}.alt`)}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${slide.objectPosition}`}
              style={{transform: "scale(1.04)"}}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,16,25,0.12)_0%,rgba(5,16,25,0.34)_52%,rgba(5,16,25,0.78)_100%)]" />
          </div>
        ))}

        <div className="absolute inset-0 z-10 flex items-end">
          <Container className="pb-[clamp(3rem,9svh,7rem)]">
            <div data-cinematic-copy className="max-w-5xl">
              <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/85">
                <p>{t("eyebrow")}</p>
                <p className="border-l border-white/50 pl-5">{t("stayLabel")}</p>
              </div>
              <h1
                id="cinematic-hero-title"
                className="max-w-5xl text-balance font-display text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.035em]"
              >
                {t("title")}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                {t("body")}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
