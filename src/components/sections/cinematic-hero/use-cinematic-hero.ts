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
    const navigationCue = section.querySelector<HTMLElement>(
      "[data-cinematic-navigation-cue]",
    );
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

    const updateNavigationCue = () => {
      if (!navigationCue || reducedMotion.matches) return;

      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
      const fadeProgress = triggeredMode
        ? progress
        : Math.min(1, Math.max(0, (progress - 0.9) / 0.1));
      const opacity = 1 - fadeProgress;

      navigationCue.style.opacity = String(opacity);
      navigationCue.style.visibility = opacity > 0.01 ? "visible" : "hidden";
    };

    const handleScroll = () => {
      requestMobileRender();
      updateNavigationCue();
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
      updateNavigationCue();
    };

    const handleReducedMotionChange = () => {
      if (reducedMotion.matches) {
        applyReducedMotion(elements);
      } else if (triggeredMode) {
        controller.applyState();
      } else {
        requestMobileRender();
      }
      updateNavigationCue();
    };

    if (reducedMotion.matches) {
      applyReducedMotion(elements);
    } else if (triggeredMode) {
      controller.applyState();
    } else {
      renderMobile();
    }
    updateNavigationCue();

    window.addEventListener("wheel", handleWheel, {passive: false});
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, {passive: true});
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      controller.destroy();
    };
  }, [counters]);

  return heroRef;
}
