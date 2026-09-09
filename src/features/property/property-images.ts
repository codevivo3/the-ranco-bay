export type PropertyImage = {
  src: string;
  width: number;
  height: number;
  altKey: string;
  category:
    | "veranda"
    | "living"
    | "bedroom"
    | "kitchen"
    | "bathroom"
    | "exterior"
    | "details";
  editorialPriority: "A" | "B" | "C";
  focalPoint?: string;
};

export const propertyImages = {
  verandaTableFlowersLakeView: {
    src: "/images/property/veranda/veranda-table-flowers-lake-view.jpeg",
    width: 1804,
    height: 1353,
    altKey: "verandaTableFlowersLakeView",
    category: "veranda",
    editorialPriority: "A",
    focalPoint: "60% 50%",
  },
  verandaHammockLakeView: {
    src: "/images/property/veranda/veranda-hammock-lake-view.jpeg",
    width: 1767,
    height: 1325,
    altKey: "verandaHammockLakeView",
    category: "veranda",
    editorialPriority: "A",
  },
  verandaDiningLakeViewWide: {
    src: "/images/property/veranda/veranda-dining-lake-view-wide.jpeg",
    width: 1684,
    height: 1263,
    altKey: "verandaDiningLakeViewWide",
    category: "veranda",
    editorialPriority: "A",
  },
  livingRoomVerandaView: {
    src: "/images/property/living/living-room-veranda-view.jpeg",
    width: 1918,
    height: 1438,
    altKey: "livingRoomVerandaView",
    category: "living",
    editorialPriority: "B",
  },
  diningLivingLakeView: {
    src: "/images/property/living/dining-living-lake-view.jpeg",
    width: 1023,
    height: 1365,
    altKey: "diningLivingLakeView",
    category: "living",
    editorialPriority: "B",
  },
  kitchenDiningOverview: {
    src: "/images/property/kitchen/kitchen-dining-overview.jpeg",
    width: 1313,
    height: 1751,
    altKey: "kitchenDiningOverview",
    category: "kitchen",
    editorialPriority: "C",
  },
  bedroomOverviewWide: {
    src: "/images/property/bedroom/bedroom-overview-wide.jpeg",
    width: 1791,
    height: 1342,
    altKey: "bedroomOverviewWide",
    category: "bedroom",
    editorialPriority: "B",
  },
  bedroomBedFront: {
    src: "/images/property/bedroom/bedroom-bed-front.jpeg",
    width: 1406,
    height: 1875,
    altKey: "bedroomBedFront",
    category: "bedroom",
    editorialPriority: "C",
  },
  bedroomBedDetail: {
    src: "/images/property/bedroom/bedroom-bed-detail.jpeg",
    width: 1937,
    height: 1452,
    altKey: "bedroomBedDetail",
    category: "bedroom",
    editorialPriority: "C",
  },
  blueCeramicVase: {
    src: "/images/property/details/blue-ceramic-vase.jpeg",
    width: 1154,
    height: 1539,
    altKey: "blueCeramicVase",
    category: "details",
    editorialPriority: "C",
  },
  bathroomOverview: {
    src: "/images/property/bathroom/bathroom-overview.jpeg",
    width: 1644,
    height: 2192,
    altKey: "bathroomOverview",
    category: "bathroom",
    editorialPriority: "C",
  },
  beachLoungersLakeView: {
    src: "/images/property/exterior/beach-loungers-lake-view.jpeg",
    width: 3291,
    height: 2468,
    altKey: "beachLoungersLakeView",
    category: "exterior",
    editorialPriority: "A",
    focalPoint: "50% 55%",
  },
  terraceLoungersLakeView: {
    src: "/images/property/exterior/terrace-loungers-lake-view.jpeg",
    width: 1337,
    height: 1783,
    altKey: "terraceLoungersLakeView",
    category: "exterior",
    editorialPriority: "B",
  },
  propertyFromLake: {
    src: "/images/property/exterior/property-from-lake.jpeg",
    width: 959,
    height: 1279,
    altKey: "propertyFromLake",
    category: "exterior",
    editorialPriority: "C",
  },
  welcomeDaffodilsLakeView: {
    src: "/images/property/details/welcome-daffodils-lake-view.jpeg",
    width: 1408,
    height: 1878,
    altKey: "welcomeDaffodilsLakeView",
    category: "details",
    editorialPriority: "B",
  },
  entranceWelcome: {
    src: "/images/property/exterior/entrance-welcome.jpeg",
    width: 2511,
    height: 3350,
    altKey: "entranceWelcome",
    category: "exterior",
    editorialPriority: "C",
  },
  wineFruitDetail: {
    src: "/images/property/details/wine-fruit-detail.jpeg",
    width: 1427,
    height: 1903,
    altKey: "wineFruitDetail",
    category: "details",
    editorialPriority: "A",
  },
} as const satisfies Record<string, PropertyImage>;

export type PropertyImageId = keyof typeof propertyImages;

export const propertyImageSlots = {
  homeAccommodation: "verandaTableFlowersLakeView",
  homeHospitality: "wineFruitDetail",
  guideWater: "beachLoungersLakeView",
  houseIntro: "verandaHammockLakeView",
  houseVeranda: "verandaDiningLakeViewWide",
  houseLiving: "livingRoomVerandaView",
  houseBedroom: "bedroomOverviewWide",
  houseDetails: "blueCeramicVase",
  houseBeach: "beachLoungersLakeView",
  contactIntro: "welcomeDaffodilsLakeView",
  contactWelcome: "entranceWelcome",
} as const satisfies Record<string, PropertyImageId>;

export type PropertyGalleryFormat = "landscape" | "portrait" | "square";

export const houseGallerySlots = {
  veranda: [
    {imageId: propertyImageSlots.houseVeranda, format: "landscape"},
    {imageId: "verandaHammockLakeView", format: "landscape"},
  ],
  living: [
    {imageId: propertyImageSlots.houseLiving, format: "landscape"},
    {imageId: "diningLivingLakeView", format: "portrait"},
    {imageId: "kitchenDiningOverview", format: "portrait"},
  ],
  bedroom: [
    {imageId: propertyImageSlots.houseBedroom, format: "landscape"},
    {imageId: "bedroomBedFront", format: "portrait"},
  ],
  details: [
    {imageId: propertyImageSlots.houseDetails, format: "portrait"},
    {imageId: "bathroomOverview", format: "portrait"},
  ],
  outside: [
    {imageId: "terraceLoungersLakeView", format: "portrait"},
    {imageId: "propertyFromLake", format: "portrait"},
  ],
  beach: [
    {imageId: propertyImageSlots.houseBeach, format: "landscape"},
  ],
} as const satisfies Record<
  string,
  readonly {imageId: PropertyImageId; format: PropertyGalleryFormat}[]
>;

export function getPropertyImage(imageId: PropertyImageId): PropertyImage {
  return propertyImages[imageId];
}
