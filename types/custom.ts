export const VALID_COMMUNITIES = ["AK91", "AK182"] as const;

export type CommunityId = (typeof VALID_COMMUNITIES)[number];
