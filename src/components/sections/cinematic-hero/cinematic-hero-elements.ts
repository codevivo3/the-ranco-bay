export type CinematicHeroElements = {
  beachSecondLine: HTMLElement | null;
  counter: HTMLElement | null;
  images: HTMLElement[];
  promisePrint: HTMLElement | null;
  sceneCopy: HTMLElement[];
  scenes: HTMLElement[];
};

export function getCinematicHeroElements(
  section: HTMLElement,
): CinematicHeroElements {
  return {
    scenes: Array.from(
      section.querySelectorAll<HTMLElement>("[data-cinematic-scene]"),
    ),
    images: Array.from(
      section.querySelectorAll<HTMLElement>("[data-cinematic-image]"),
    ),
    sceneCopy: Array.from(
      section.querySelectorAll<HTMLElement>("[data-cinematic-copy]"),
    ),
    promisePrint: section.querySelector<HTMLElement>(
      "[data-cinematic-print]",
    ),
    beachSecondLine: section.querySelector<HTMLElement>(
      "[data-cinematic-beach-line-two]",
    ),
    counter: section.querySelector<HTMLElement>("[data-cinematic-counter]"),
  };
}

export function getImageSceneIndex(
  image: HTMLElement,
  elements: CinematicHeroElements,
) {
  const scene = image.closest<HTMLElement>("[data-cinematic-scene]");
  return scene ? elements.scenes.indexOf(scene) : 0;
}

export function getSceneImages(
  sceneIndex: number,
  elements: CinematicHeroElements,
) {
  return elements.images.filter(
    (image) => getImageSceneIndex(image, elements) === sceneIndex,
  );
}

export function getSceneCopy(
  sceneIndex: number,
  elements: CinematicHeroElements,
) {
  return elements.sceneCopy.find(
    (copy) => Number(copy.dataset.scene ?? 0) === sceneIndex,
  );
}
