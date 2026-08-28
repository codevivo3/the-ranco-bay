import {useEffect, useRef} from "react";

import {TRIGGERED_BREAKPOINT} from "@/components/sections/cinematic-hero/cinematic-hero.config";
import {getCinematicHeroElements} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {createTriggeredHeroController} from "@/components/sections/cinematic-hero/create-triggered-hero-controller";
import {renderCinematicHeroMobile} from "@/components/sections/cinematic-hero/render-cinematic-hero-mobile";
import {applyReducedMotion} from "@/components/sections/cinematic-hero/cinematic-hero-states";

export function useCinematicHero(counters: string[]) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const elements = getCinematicHeroElements(section);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = createTriggeredHeroController({
      counters,
      elements,
      section,
    });
    let animationFrame: number | null = null;
    let triggeredMode = window.innerWidth >= TRIGGERED_BREAKPOINT;

    const renderMobile = () => {
      renderCinematicHeroMobile({counters, elements, section});
    };

    const requestMobileRender = () => {
      if (
        !triggeredMode &&
        !reducedMotion.matches &&
        animationFrame === null
      ) {
        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = null;
          renderMobile();
        });
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!triggeredMode || reducedMotion.matches) {
        controller.resetGesture();
        return;
      }
      controller.handleWheel(event);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!triggeredMode || reducedMotion.matches) return;
      controller.handleKeyDown(event);
    };

    const handleResize = () => {
      const nextTriggeredMode = window.innerWidth >= TRIGGERED_BREAKPOINT;
      if (nextTriggeredMode !== triggeredMode) {
        triggeredMode = nextTriggeredMode;
        controller.reset();
      }
      if (reducedMotion.matches) {
        applyReducedMotion(elements);
      } else if (triggeredMode) {
        controller.applyState();
      } else {
        requestMobileRender();
      }
    };

    const handleReducedMotionChange = () => {
      if (reducedMotion.matches) {
        applyReducedMotion(elements);
      } else if (triggeredMode) {
        controller.applyState();
      } else {
        requestMobileRender();
      }
    };

    if (reducedMotion.matches) {
      applyReducedMotion(elements);
    } else if (triggeredMode) {
      controller.applyState();
    } else {
      renderMobile();
    }

    window.addEventListener("wheel", handleWheel, {passive: false});
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", requestMobileRender, {passive: true});
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", requestMobileRender);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      controller.destroy();
    };
  }, [counters]);

  return heroRef;
}
