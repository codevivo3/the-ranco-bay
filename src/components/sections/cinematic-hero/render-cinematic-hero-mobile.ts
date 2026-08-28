import type {CinematicHeroElements} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {getImageSceneIndex} from "@/components/sections/cinematic-hero/cinematic-hero-elements";
import {
  clamp,
  ease,
  progressBetween,
} from "@/components/sections/cinematic-hero/cinematic-hero-motion";

type MobileRendererOptions = {
  counters: string[];
  elements: CinematicHeroElements;
  section: HTMLElement;
};

export function renderCinematicHeroMobile({
  counters,
  elements,
  section,
}: MobileRendererOptions) {
  const {beachSecondLine, counter, images, promisePrint, sceneCopy, scenes} =
    elements;
  const scrollDistance = Math.max(
    section.offsetHeight - window.innerHeight,
    1,
  );
  const progress = clamp(-section.getBoundingClientRect().top / scrollDistance);
  const sceneSpan = 1 / (scenes.length - 1);
  const compact = window.innerWidth < 640;
  const promiseProgress = ease(clamp(progress / sceneSpan));
  const printReveal = ease(clamp((promiseProgress - 0.48) / 0.44));
  const activeScene = Math.min(
    Math.floor(progress / sceneSpan + 0.45),
    scenes.length - 1,
  );

  if (counter) counter.textContent = counters[activeScene];
  if (promisePrint) {
    const printEdge = compact ? 8 : 14;
    const printScale = compact ? 0.99 : 0.98;
    promisePrint.style.padding = `${printEdge * printReveal}px`;
    promisePrint.style.borderRadius = `${4 * printReveal}px`;
    promisePrint.style.transform = `scale(${1 - (1 - printScale) * printReveal})`;
  }

  scenes.forEach((scene, index) => {
    scene.style.visibility = "visible";
    if (index === 0) {
      const departure = ease(
        clamp((progress - sceneSpan * 0.28) / (sceneSpan * 0.72)),
      );
      scene.style.clipPath = "none";
      scene.style.opacity = String(1 - departure * 0.18);
      scene.style.transform = "none";
      return;
    }

    const localProgress = clamp(
      (progress - (index - 1) * sceneSpan) / sceneSpan,
    );
    if (index === 1 || index === 2) {
      const arrival = progressBetween(localProgress, 0.08, 0.52);
      const departure = ease(
        clamp(
          (progress - index * sceneSpan - sceneSpan * 0.28) /
            (sceneSpan * 0.72),
        ),
      );
      const entranceTravel = index === 1 ? (compact ? 5 : 7) : compact ? 4 : 6;
      scene.style.clipPath = "none";
      scene.style.opacity = String(arrival * (1 - departure * 0.16));
      scene.style.transform = `translate3d(0, ${entranceTravel * (1 - arrival)}svh, 0)`;
      return;
    }
    if (index === scenes.length - 1) {
      const arrival = progressBetween(localProgress, 0.04, 0.62);
      const entranceTravel = compact ? 72 : 100;
      scene.style.clipPath = "none";
      scene.style.opacity = arrival === 0 ? "0" : "1";
      scene.style.transform = `translate3d(0, ${entranceTravel * (1 - arrival)}svh, 0)`;
      return;
    }
    if (index === 3) {
      const arrival = progressBetween(localProgress, 0.02, 0.25);
      scene.style.clipPath = "none";
      scene.style.opacity = String(arrival);
      scene.style.transform = `translate3d(0, ${(compact ? 3.5 : 5.5) * (1 - arrival)}svh, 0)`;
      return;
    }
    const arrival = progressBetween(localProgress, 0.1, 0.62);
    scene.style.opacity = arrival === 0 ? "0" : "1";
    scene.style.clipPath = `inset(${100 * (1 - arrival)}% 0 0 0)`;
    scene.style.transform = `translate3d(0, ${(compact ? 4 : 7) * (1 - arrival)}svh, 0)`;
  });

  images.forEach((image) => {
    const sceneIndex = getImageSceneIndex(image, elements);
    const rawProgress =
      sceneIndex === 0
        ? clamp(progress / sceneSpan)
        : clamp((progress - (sceneIndex - 1) * sceneSpan) / sceneSpan);
    const localProgress = ease(rawProgress);
    const drift = Number(image.dataset.drift ?? (compact ? 2 : 4));

    if (sceneIndex === 0) {
      const promiseDrift = compact ? 1 : 2.5;
      image.style.transform = `translate3d(0, ${-promiseDrift * localProgress}svh, 0) scale(${1 + 0.02 * localProgress})`;
      return;
    }
    if (sceneIndex === 1) {
      const insideDrift = Math.min(drift, compact ? 1 : 2);
      const settled = progressBetween(rawProgress, 0.08, 0.52);
      image.style.transform = `translate3d(0, ${-insideDrift * settled}svh, 0) scale(${1.01 + 0.008 * settled})`;
      return;
    }
    if (sceneIndex === 2) {
      const outsideDrift = compact ? 1.5 : 3;
      const settled = progressBetween(rawProgress, 0.08, 0.52);
      image.style.transform = `translate3d(0, ${-outsideDrift * settled}svh, 0) scale(${1.01 + 0.012 * settled})`;
      return;
    }
    if (sceneIndex === 3) {
      const beachDrift = compact ? 1 : 2.5;
      const settled = progressBetween(rawProgress, 0.02, 0.25);
      image.style.transform = `translate3d(0, ${-beachDrift * settled}svh, 0) scale(${1.01 + 0.01 * settled})`;
      return;
    }
    const motionScale = compact ? 0.008 : 0.014;
    const settled = progressBetween(rawProgress, 0.04, 0.62);
    image.style.transform = `translate3d(0, ${-drift * settled}svh, 0) scale(${1.035 + motionScale * settled})`;
  });

  sceneCopy.forEach((copy) => {
    const copyScene = Number(copy.dataset.scene ?? 0);
    if (copyScene === 0) {
      const departure = ease(
        clamp((progress - sceneSpan * 0.38) / (sceneSpan * 0.42)),
      );
      copy.style.opacity = String(1 - departure);
      copy.style.transform = `translate3d(0, ${-(compact ? 2 : 3) * departure}svh, 0)`;
      return;
    }
    const localProgress = clamp(
      (progress - (copyScene - 1) * sceneSpan) / sceneSpan,
    );
    const arrival = progressBetween(localProgress, 0.34, 0.56);
    const copyTravel = copyScene === 1 ? (compact ? 1.5 : 2.5) : compact ? 2 : 3;

    if (copyScene === 3) {
      const beachCopyArrival = progressBetween(localProgress, 0.3, 0.4);
      const barefootArrival = progressBetween(localProgress, 0.52, 0.72);
      const barefootOpacity = progressBetween(localProgress, 0.52, 0.58);
      copy.style.opacity = String(beachCopyArrival);
      copy.style.transform = `translate3d(0, ${(compact ? 1 : 1.5) * (1 - beachCopyArrival)}svh, 0)`;
      if (beachSecondLine) {
        beachSecondLine.style.opacity = String(barefootOpacity);
        beachSecondLine.style.transform = `translate3d(0, ${110 * (1 - barefootArrival)}%, 0)`;
      }
      return;
    }
    const departure =
      copyScene === 1 || copyScene === 2
        ? ease(
            clamp(
              (progress - copyScene * sceneSpan - sceneSpan * 0.16) /
                (sceneSpan * 0.44),
            ),
          )
        : 0;
    const departureTravel =
      copyScene === 1 ? (compact ? 1.5 : 2.5) : compact ? 2 : 3;
    copy.style.opacity = String(arrival * (1 - departure));
    copy.style.transform = `translate3d(0, ${copyTravel * (1 - arrival) - departureTravel * departure}svh, 0)`;
  });
}
