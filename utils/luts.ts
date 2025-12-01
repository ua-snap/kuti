export const VALID_COMMUNITIES = ["Craig", "Kasaan"] as const;

export type Community = (typeof VALID_COMMUNITIES)[number];

export const isValidCommunity = (value: string): value is Community => {
  return VALID_COMMUNITIES.includes(value as Community);
};

export const COMMUNITY_LOCATIONS: Record<
  Community,
  { lat: number; lng: number; zoom: number }
> = {
  Craig: { lat: 55.476389, lng: -133.147778, zoom: 13 },
  Kasaan: { lat: 55.541667, lng: -132.401944, zoom: 13 },
};
