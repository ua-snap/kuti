export const VALID_COMMUNITIES = ["AK91", "AK182"] as const;

export type Community = (typeof VALID_COMMUNITIES)[number];

export const isValidCommunity = (value: string): value is Community => {
  return VALID_COMMUNITIES.includes(value as Community);
};

export const getCommunityName = (communityId: Community): string => {
  return COMMUNITY_LOCATIONS[communityId].name;
};

export const COMMUNITY_LOCATIONS: Record<
  Community,
  { name: string; lat: number; lng: number; zoom: number }
> = {
  AK91: { name: "Craig", lat: 55.476389, lng: -133.147778, zoom: 13 },
  AK182: { name: "Kasaan", lat: 55.541667, lng: -132.401944, zoom: 13 },
};
