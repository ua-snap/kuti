export type CommunityId = "AK91" | "AK182";

export interface LandslideData {
  community: {
    name: string;
    latitude: number;
    longitude: number;
  };
  expires_at: string;
  hour: string;
  precipitation_24hr: number;
  precipitation_2days: number;
  precipitation_3days: number;
  precipitation_inches: number;
  precipitation_mm: number;
  risk_24hr: number;
  risk_2days: number;
  risk_3days: number;
  risk_level: number;
  risk_probability: number;
  timestamp: string;
}
