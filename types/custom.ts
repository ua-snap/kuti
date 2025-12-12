export type CommunityId = "AK91" | "AK182";
export enum CommunityNames {
  AK91 = "Craig (Sháan Séet)",
  AK182 = "Kasaan (Gasa'áan)",
}

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

export enum ApiResponse {
  API_HTTP_RESPONSE_STALE_DATA = 409,
  API_HTTP_RESPONSE_DATABASE_UNREACHABLE = 502,
  API_HTTP_RESPONSE_GENERAL_ERROR = 500,
}
