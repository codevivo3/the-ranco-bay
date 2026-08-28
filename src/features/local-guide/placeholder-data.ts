export const guideCategories = ["eat", "water", "explore"] as const;

export type GuideCategory = (typeof guideCategories)[number];

export type GuideEntry = {
  active: boolean;
  category: GuideCategory;
  featured: boolean;
  format: "landscape" | "portrait";
  homepageEligible: boolean;
  id: "lakeside-table" | "open-water" | "ranco-outlook";
  image: string;
  mapsUrl: string | null;
  seasonal: boolean;
  tags: readonly string[];
};

// Temporary, deterministic stand-ins for the future normalized Sanity result.
// Content remains in next-intl; this configuration models editorial eligibility.
export const placeholderGuideEntries: readonly GuideEntry[] = [
  {
    id: "lakeside-table",
    category: "eat",
    image: "/images/property/image2-a.jpg",
    mapsUrl: null,
    homepageEligible: true,
    featured: true,
    format: "landscape",
    seasonal: false,
    active: true,
    tags: ["lunch", "sunset"],
  },
  {
    id: "open-water",
    category: "water",
    image: "/images/property/image4.jpg",
    mapsUrl: null,
    homepageEligible: true,
    featured: true,
    format: "landscape",
    seasonal: true,
    active: true,
    tags: ["swimming", "halfDay"],
  },
  {
    id: "ranco-outlook",
    category: "explore",
    image: "/images/property/image3.png",
    mapsUrl: null,
    homepageEligible: true,
    featured: true,
    format: "landscape",
    seasonal: false,
    active: true,
    tags: ["withoutCar", "halfDay"],
  },
];

export function getHomepageGuideEntries() {
  return guideCategories.map((category) => {
    const entry = placeholderGuideEntries.find(
      (candidate) =>
        candidate.category === category &&
        candidate.active &&
        candidate.homepageEligible &&
        candidate.featured,
    );

    if (!entry) {
      throw new Error(`Missing homepage guide entry for ${category}`);
    }

    return entry;
  });
}
