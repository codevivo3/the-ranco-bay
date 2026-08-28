import {
  BAREFOOT_HIDDEN_TRANSFORM,
  BAREFOOT_TRANSITION_MS,
  NARRATIVE_SCENES,
  SCENE_04_COPY_TRANSITION_MS,
  SCENE_EASING,
  SCENE_ENTRANCE_SVH,
  SCENE_OPACITY_EASING,
  SCENE_OPACITY_EXIT_EASING,
  SCENE_PUSH_MS,
  SCENE_TRANSITION_MS,
} from "@/components/sections/cinematic-hero/cinematic-hero.config";
import type {CinematicHeroElements} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {
  getSceneCopy,
  getSceneImages,
} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {
  getPushedImageTransform,
  getSceneCopyDrift,
} from "@/components/sections/cinematic-hero/cinematic-hero-motion";
import {
  getElementImageTransform,
} from "@/components/sections/cinematic-hero/cinematic-hero-states";

type FinishTransition = (nextState: number, duration: number) => void;

export function animateBarefoot(
  forward: boolean,
  elements: CinematicHeroElements,
  finishTransition: FinishTransition,
) {
  const line = elements.beachSecondLine;
  if (!line) return;

  line.style.transition = "none";
  line.style.opacity = forward ? "0" : "1";
  line.style.transform = forward ? BAREFOOT_HIDDEN_TRANSFORM : "none";
  void line.offsetHeight;
  line.style.transition = `transform ${BAREFOOT_TRANSITION_MS}ms ${SCENE_EASING}, opacity ${BAREFOOT_TRANSITION_MS}ms ${SCENE_EASING}`;
  line.style.opacity = forward ? "1" : "0";
  line.style.transform = forward ? "none" : BAREFOOT_HIDDEN_TRANSFORM;
  finishTransition(forward ? 4 : 3, BAREFOOT_TRANSITION_MS);
}

export function animateSceneForward(
  fromState: number,
  toState: number,
  elements: CinematicHeroElements,
  finishTransition: FinishTransition,
) {
  const outgoingIndex = NARRATIVE_SCENES[fromState];
  const incomingIndex = NARRATIVE_SCENES[toState];
  const incoming = elements.scenes[incomingIndex];
  const outgoingImages = getSceneImages(outgoingIndex, elements);
  const outgoingCopy = getSceneCopy(outgoingIndex, elements);
  const incomingCopy = getSceneCopy(incomingIndex, elements);
  const sceneDelay = 160;
  const copyDelay = incomingIndex === 3 ? 550 : 280;
  const copyDuration =
    incomingIndex === 3 ? SCENE_04_COPY_TRANSITION_MS : 620;
  const totalDuration = Math.max(
    sceneDelay + SCENE_TRANSITION_MS,
    copyDelay + copyDuration,
  );

  incoming.style.transition = "none";
  incoming.style.clipPath = "none";
  incoming.style.opacity = "0";
  incoming.style.visibility = "visible";
  incoming.style.transform = `translate3d(0, ${SCENE_ENTRANCE_SVH}svh, 0)`;
  outgoingImages.forEach((image) => {
    image.style.transition = "none";
    image.style.transform = getElementImageTransform(image, elements);
  });
  if (outgoingCopy) {
    outgoingCopy.style.transition = "none";
    outgoingCopy.style.opacity = "1";
    outgoingCopy.style.transform = "none";
  }
  if (incomingCopy) {
    incomingCopy.style.transition = "none";
    incomingCopy.style.opacity = "0";
    incomingCopy.style.transform = "translate3d(0, 24px, 0)";
  }

  void incoming.offsetHeight;
  incoming.style.transition = `transform ${SCENE_TRANSITION_MS}ms ${SCENE_EASING} ${sceneDelay}ms, opacity ${SCENE_TRANSITION_MS}ms ${SCENE_OPACITY_EASING} ${sceneDelay}ms`;
  incoming.style.opacity = "1";
  incoming.style.transform = "none";
  outgoingImages.forEach((image) => {
    const sceneIndex = outgoingIndex;
    image.style.transition = `transform ${SCENE_PUSH_MS}ms ${SCENE_EASING}`;
    image.style.transform = getPushedImageTransform(
      sceneIndex,
      Number(image.dataset.drift ?? 0),
    );
  });
  if (outgoingCopy) {
    outgoingCopy.style.transition = `transform ${SCENE_PUSH_MS}ms ${SCENE_EASING}`;
    outgoingCopy.style.transform = getSceneCopyDrift(outgoingIndex);
  }
  if (incomingCopy) {
    incomingCopy.style.transition = `transform ${copyDuration}ms ${SCENE_EASING} ${copyDelay}ms, opacity ${copyDuration}ms ${SCENE_EASING} ${copyDelay}ms`;
    incomingCopy.style.opacity = "1";
    incomingCopy.style.transform = "none";
  }
  finishTransition(toState, totalDuration);
}

export function animateSceneBackward(
  fromState: number,
  toState: number,
  elements: CinematicHeroElements,
  finishTransition: FinishTransition,
) {
  const outgoingIndex = NARRATIVE_SCENES[fromState];
  const outgoing = elements.scenes[outgoingIndex];
  const incomingIndex = NARRATIVE_SCENES[toState];
  const incoming = elements.scenes[incomingIndex];
  const incomingImages = getSceneImages(incomingIndex, elements);
  const incomingCopy = getSceneCopy(incomingIndex, elements);

  incoming.style.transition = "none";
  incoming.style.clipPath = "none";
  incoming.style.opacity = "1";
  incoming.style.transform = "none";
  incoming.style.visibility = "visible";
  incomingImages.forEach((image) => {
    image.style.transition = "none";
    image.style.transform = getPushedImageTransform(
      incomingIndex,
      Number(image.dataset.drift ?? 0),
    );
  });
  if (incomingCopy) {
    incomingCopy.style.transition = "none";
    incomingCopy.style.opacity = "1";
    incomingCopy.style.transform = getSceneCopyDrift(incomingIndex);
  }

  outgoing.style.transition = "none";
  outgoing.style.clipPath = "none";
  outgoing.style.opacity = "1";
  outgoing.style.transform = "none";
  outgoing.style.visibility = "visible";
  void outgoing.offsetHeight;
  outgoing.style.transition = `transform ${SCENE_TRANSITION_MS}ms ${SCENE_EASING}, opacity ${SCENE_TRANSITION_MS}ms ${SCENE_OPACITY_EXIT_EASING}`;
  outgoing.style.opacity = "0";
  outgoing.style.transform = `translate3d(0, ${SCENE_ENTRANCE_SVH}svh, 0)`;
  incomingImages.forEach((image) => {
    image.style.transition = `transform 650ms ${SCENE_EASING} 220ms`;
    image.style.transform = getElementImageTransform(image, elements);
  });
  if (incomingCopy) {
    incomingCopy.style.transition = `transform 650ms ${SCENE_EASING} 220ms`;
    incomingCopy.style.transform = "none";
  }
  finishTransition(toState, SCENE_TRANSITION_MS);
}
