import {NARRATIVE_SCENES} from "@/components/sections/cinematic-hero/cinematic-hero.config";
import type {CinematicHeroElements} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {applyTriggeredState} from "@/components/sections/cinematic-hero/cinematic-hero-states";
import {
  animateBarefoot,
  animateSceneBackward,
  animateSceneForward,
} from "@/components/sections/cinematic-hero/cinematic-hero-transitions";

type ControllerOptions = {
  counters: string[];
  elements: CinematicHeroElements;
  section: HTMLElement;
};

export function createTriggeredHeroController({
  counters,
  elements,
  section,
}: ControllerOptions) {
  let transitionTimer: number | null = null;
  let wheelResetTimer: number | null = null;
  let gestureReadyTimer: number | null = null;
  let currentState = 0;
  let transitioning = false;
  let gestureReady = true;
  let wheelAccumulator = 0;
  let wheelDirection = 0;

  const armAfterGestureEnds = () => {
    if (gestureReadyTimer !== null) {
      window.clearTimeout(gestureReadyTimer);
    }
    gestureReadyTimer = window.setTimeout(() => {
      if (!transitioning) {
        gestureReady = true;
        wheelAccumulator = 0;
        wheelDirection = 0;
      }
    }, 220);
  };

  const finishTransition = (nextState: number, duration: number) => {
    if (transitionTimer !== null) window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      currentState = nextState;
      transitioning = false;
      applyTriggeredState(currentState, counters, elements);
      armAfterGestureEnds();
    }, duration);
  };

  const beginTransition = (direction: 1 | -1) => {
    const nextState = currentState + direction;
    if (
      transitioning ||
      nextState < 0 ||
      nextState >= NARRATIVE_SCENES.length
    ) {
      return;
    }

    transitioning = true;
    gestureReady = false;
    wheelAccumulator = 0;
    wheelDirection = 0;
    if (currentState === 3 && nextState === 4) {
      animateBarefoot(true, elements, finishTransition);
    } else if (currentState === 4 && nextState === 3) {
      animateBarefoot(false, elements, finishTransition);
    } else if (direction === 1) {
      animateSceneForward(currentState, nextState, elements, finishTransition);
    } else {
      animateSceneBackward(currentState, nextState, elements, finishTransition);
    }
  };

  const heroIsActive = () => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
  };

  const normalizeWheelDelta = (event: WheelEvent) => {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return event.deltaY * window.innerHeight;
    }
    return event.deltaY;
  };

  return {
    applyState() {
      applyTriggeredState(currentState, counters, elements);
    },
    destroy() {
      if (transitionTimer !== null) window.clearTimeout(transitionTimer);
      if (wheelResetTimer !== null) window.clearTimeout(wheelResetTimer);
      if (gestureReadyTimer !== null) window.clearTimeout(gestureReadyTimer);
    },
    handleKeyDown(event: KeyboardEvent) {
      if (!heroIsActive() || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.matches("input, textarea, select, button")
      ) {
        return;
      }
      const forward =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.code === "Space" && !event.shiftKey);
      const backward =
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.code === "Space" && event.shiftKey);
      if (!forward && !backward) return;
      const direction = forward ? 1 : -1;
      const releasesDown =
        currentState === NARRATIVE_SCENES.length - 1 && direction > 0;
      const releasesUp = currentState === 0 && direction < 0;
      if (releasesDown || releasesUp) return;
      event.preventDefault();
      if (!transitioning) beginTransition(direction);
    },
    handleWheel(event: WheelEvent) {
      if (!heroIsActive()) {
        wheelAccumulator = 0;
        wheelDirection = 0;
        return;
      }
      const delta = normalizeWheelDelta(event);
      const direction = Math.sign(delta);
      const releasesDown =
        currentState === NARRATIVE_SCENES.length - 1 && direction > 0;
      const releasesUp = currentState === 0 && direction < 0;
      if (releasesDown || releasesUp) {
        wheelAccumulator = 0;
        wheelDirection = 0;
        return;
      }
      event.preventDefault();
      if (transitioning || !gestureReady || Math.abs(delta) < 2) {
        armAfterGestureEnds();
        return;
      }
      if (direction !== wheelDirection) {
        wheelAccumulator = 0;
        wheelDirection = direction;
      }
      wheelAccumulator += delta;
      if (wheelResetTimer !== null) window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelAccumulator = 0;
        wheelDirection = 0;
      }, 180);
      if (Math.abs(wheelAccumulator) >= 48) {
        beginTransition(direction > 0 ? 1 : -1);
      }
    },
    reset() {
      transitioning = false;
      currentState = 0;
      gestureReady = true;
    },
    resetGesture() {
      wheelAccumulator = 0;
      wheelDirection = 0;
    },
  };
}
