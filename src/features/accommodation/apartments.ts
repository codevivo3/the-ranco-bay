export const apartmentIds = ['ground-floor', 'upper-floor'] as const;

export type ApartmentId = (typeof apartmentIds)[number];

export const apartments = {
  'ground-floor': {
    availability: 'live',
    href: '/house',
    translationKey: 'groundFloor',
  },
  'upper-floor': {
    availability: 'coming-soon',
    href: '/apartments/upper-floor',
    translationKey: 'upperFloor',
  },
} as const satisfies Record<
  ApartmentId,
  {
    availability: 'coming-soon' | 'live';
    href: '/apartments/upper-floor' | '/house';
    translationKey: 'groundFloor' | 'upperFloor';
  }
>;

export function isApartmentId(value: unknown): value is ApartmentId {
  return apartmentIds.some((apartmentId) => apartmentId === value);
}
