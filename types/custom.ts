export type CommunityId = "AK91" | "AK182";

export interface CommunityLocation {
  [id: CommunityId]: {
    lat: number;
    lng: number;
  };
}

export enum CommunityNames {
  AK91 = "Craig (Sháan Séet)",
  AK182 = "Kasaan (Gasa'áan)",
}

export const communityLocations: CommunityLocation = {
  AK91: {
    lat: 55.4764,
    lng: -133.118,
  },
  AK182: {
    lat: 55.5389,
    lng: -132.401,
  },
};

export interface ForecastBlock {
  antecedent_mm: number;
  forecast_hour: number;
  intensity_mm: number;
  risk_level: number;
  risk_threshold_upper: number;
  timestamp: string;
}

export interface LandslideData {
  community: {
    alt_name?: string;
    country?: string;
    id?: string;
    is_coastal?: number;
    name: string;
    latitude: number;
    longitude: number;
    ocean_lat1?: number;
    ocean_lon1?: number;
    region?: string;
    tags?: string;
    type?: string;
  };
  expires_at: string;
  forecast_blocks: ForecastBlock[];
  gauge_id: string;
  place_id: string;
  place_name: string;
  realtime_antecedent_mm: string;
  realtime_rainfall_mm: string;
  realtime_risk_level: number;
  realtime_threshold_upper: string;
  timestamp: string;
}

export enum ApiResponse {
  API_HTTP_RESPONSE_STALE_DATA = 409,
  API_HTTP_RESPONSE_DATABASE_UNREACHABLE = 502,
  API_HTTP_RESPONSE_GENERAL_ERROR = 500,
  API_HTTP_RESPONSE_TIMEOUT = 408,
}
