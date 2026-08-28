export const SCENE_IMAGES = {
  promise: {
    src: "/images/property/image1.jpg",
    altKey: "scenes.promise.alt",
    drift: 3,
  },
  inside: [
    {
      src: "/images/property/image2-a.jpg",
      altKey: "scenes.inside.windowAlt",
      drift: 2,
    },
    {
      src: "/images/property/image2-b.jpg",
      altKey: "scenes.inside.sculptureAlt",
      drift: 5,
    },
    {
      src: "/images/property/image2-c.jpg",
      altKey: "scenes.inside.bedsideAlt",
      drift: 3.5,
    },
    {
      src: "/images/property/image2-d.jpg",
      altKey: "scenes.inside.detailAlt",
      drift: 6,
    },
  ],
  outside: {
    src: "/images/property/image3.png",
    altKey: "scenes.outside.alt",
    drift: 5,
  },
  privateBeach: {
    src: "/images/property/image4.jpg",
    altKey: "scenes.privateBeach.alt",
    drift: 3,
  },
  reveal: {
    src: "/images/property/image5.jpg",
    altKey: "scenes.reveal.alt",
    drift: 1.5,
  },
} as const;

export const SCENE_COUNT = 5;
export const NARRATIVE_SCENES = [0, 1, 2, 3, 3, 4] as const;
export const TRIGGERED_BREAKPOINT = 768;
export const SCENE_ENTRANCE_SVH = 100;
export const SCENE_TRANSITION_MS = 990;
export const SCENE_PUSH_MS = 700;
export const SCENE_PUSH_TARGET_SCALE = 1.05;
export const SCENE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
export const SCENE_OPACITY_EASING = "cubic-bezier(0.25, 0.05, 0.4, 1)";
export const SCENE_OPACITY_EXIT_EASING =
  "cubic-bezier(0.6, 0, 0.75, 0.95)";
export const SCENE_04_COPY_TRANSITION_MS = 650;
export const BAREFOOT_TRANSITION_MS = SCENE_04_COPY_TRANSITION_MS;
export const BAREFOOT_HIDDEN_TRANSFORM = "translate3d(0, 110%, 0)";
