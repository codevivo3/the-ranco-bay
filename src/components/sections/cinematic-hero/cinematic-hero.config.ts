import {getPropertyImage} from "@/features/property/property-images";

const cinematicPropertyImages = {
  promise: getPropertyImage("verandaTableFlowersLakeView"),
  insideDominant: getPropertyImage("livingRoomVerandaView"),
  insideUpperDetail: getPropertyImage("blueCeramicVase"),
  insideBedsideDetail: getPropertyImage("bedroomBedDetail"),
  insideSmallDetail: getPropertyImage("wineFruitDetail"),
  outside: getPropertyImage("terraceLoungersLakeView"),
  privateBeach: getPropertyImage("beachLoungersLakeView"),
  reveal: getPropertyImage("welcomeDaffodilsLakeView"),
};

export const SCENE_IMAGES = {
  promise: {
    src: cinematicPropertyImages.promise.src,
    altKey: "scenes.promise.alt",
    drift: 3,
  },
  inside: [
    {
      src: cinematicPropertyImages.insideDominant.src,
      altKey: "scenes.inside.windowAlt",
      drift: 2,
    },
    {
      src: cinematicPropertyImages.insideUpperDetail.src,
      altKey: "scenes.inside.sculptureAlt",
      drift: 5,
    },
    {
      src: cinematicPropertyImages.insideBedsideDetail.src,
      altKey: "scenes.inside.bedsideAlt",
      drift: 3.5,
    },
    {
      src: cinematicPropertyImages.insideSmallDetail.src,
      altKey: "scenes.inside.detailAlt",
      drift: 6,
    },
  ],
  outside: {
    src: cinematicPropertyImages.outside.src,
    altKey: "scenes.outside.alt",
    drift: 5,
  },
  privateBeach: {
    src: cinematicPropertyImages.privateBeach.src,
    altKey: "scenes.privateBeach.alt",
    drift: 3,
  },
  reveal: {
    src: cinematicPropertyImages.reveal.src,
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
