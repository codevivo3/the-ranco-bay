import {
  BAREFOOT_HIDDEN_TRANSFORM,
  NARRATIVE_SCENES,
  SCENE_ENTRANCE_SVH,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";
import type {CinematicHeroElements} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {getImageSceneIndex} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {
  getTriggeredImageTransform,
} from "@/components/sections/cinematic-hero/cinematic-hero-motion";

export function getElementImageTransform(
  image: HTMLElement,
  elements: CinematicHeroElements,
) {
  return getTriggeredImageTransform(
    getImageSceneIndex(image, elements),
    Number(image.dataset.drift ?? 0),
  );
}

export function setPrintState(
  promisePrint: HTMLElement | null,
  developed: boolean,
) {
  if (!promisePrint) return;
  promisePrint.style.padding = developed ? "14px" : "0";
  promisePrint.style.borderRadius = developed ? "4px" : "0";
  promisePrint.style.transform = developed ? "scale(0.98)" : "none";
}

function setCounter(
  elements: CinematicHeroElements,
  counters: string[],
  state: number,
) {
  if (elements.counter) {
    elements.counter.textContent = counters[NARRATIVE_SCENES[state]];
  }
}

export function setTriggeredImageStates(elements: CinematicHeroElements) {
  elements.images.forEach((image) => {
    image.style.transition = "none";
    image.style.transform = getElementImageTransform(image, elements);
  });
}

export function applyReducedMotion(elements: CinematicHeroElements) {
  elements.scenes.forEach((scene) => {
    scene.style.transition = "none";
    scene.style.clipPath = "none";
    scene.style.opacity = "1";
    scene.style.transform = "none";
    scene.style.visibility = "visible";
  });
  elements.images.forEach((image) => {
    image.style.transition = "none";
    image.style.transform = "none";
  });
  elements.sceneCopy.forEach((copy) => {
    copy.style.transition = "none";
    copy.style.opacity = "1";
    copy.style.transform = "none";
  });
  if (elements.promisePrint) {
    elements.promisePrint.style.transition = "none";
    elements.promisePrint.style.padding = "0";
    elements.promisePrint.style.borderRadius = "0";
    elements.promisePrint.style.transform = "none";
  }
  if (elements.beachSecondLine) {
    elements.beachSecondLine.style.transition = "none";
    elements.beachSecondLine.style.opacity = "1";
    elements.beachSecondLine.style.transform = "none";
  }
}

export function applyTriggeredState(
  state: number,
  counters: string[],
  elements: CinematicHeroElements,
) {
  const activeScene = NARRATIVE_SCENES[state];

  elements.scenes.forEach((scene, index) => {
    scene.style.transition = "none";
    scene.style.clipPath = "none";
    scene.style.opacity = "1";
    scene.style.visibility = index === activeScene ? "visible" : "hidden";
    scene.style.transform =
      index <= activeScene
        ? "none"
        : `translate3d(0, ${SCENE_ENTRANCE_SVH}svh, 0)`;
  });
  setTriggeredImageStates(elements);
  elements.sceneCopy.forEach((copy) => {
    const copyScene = Number(copy.dataset.scene ?? 0);
    const visible = copyScene <= activeScene;
    copy.style.transition = "none";
    copy.style.opacity = visible ? "1" : "0";
    copy.style.transform = visible ? "none" : "translate3d(0, 24px, 0)";
  });
  if (elements.beachSecondLine) {
    const visible = state >= 4;
    elements.beachSecondLine.style.transition = "none";
    elements.beachSecondLine.style.opacity = visible ? "1" : "0";
    elements.beachSecondLine.style.transform = visible
      ? "none"
      : BAREFOOT_HIDDEN_TRANSFORM;
  }
  if (elements.promisePrint) {
    elements.promisePrint.style.transition = "none";
  }
  setPrintState(elements.promisePrint, false);
  setCounter(elements, counters, state);
}
