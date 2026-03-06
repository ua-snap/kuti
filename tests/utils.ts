import type { Page, Route } from "@playwright/test";

export interface MockForecastBlock {
  antecedent_mm: number;
  forecast_hour: number;
  intensity_mm: number;
  risk_level: number;
  risk_threshold_upper: number;
  timestamp: string;
}

export interface MockLandslideData {
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
  forecast_blocks: MockForecastBlock[];
  gauge_id: string;
  place_id: string;
  place_name: string;
  realtime_antecedent_mm: string;
  realtime_rainfall_mm: string;
  realtime_risk_level: number;
  realtime_threshold_upper: string;
  timestamp: string;
}

/**
 * Generate forecast blocks for testing (24 blocks spanning 72 hours)
 */
function generateForecastBlocks(startTime: Date): MockForecastBlock[] {
  const blocks: MockForecastBlock[] = [];
  const threeHoursInMs = 3 * 60 * 60 * 1000;

  for (let i = 0; i < 24; i++) {
    const blockTime = new Date(startTime.getTime() + i * threeHoursInMs);
    blocks.push({
      antecedent_mm: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      forecast_hour: (i + 1) * 3,
      intensity_mm: parseFloat((Math.random() * 5).toFixed(2)),
      risk_level: Math.floor(Math.random() * 3), // 0, 1, or 2
      risk_threshold_upper: parseFloat((Math.random() * 5 + 12).toFixed(2)),
      timestamp: blockTime.toISOString(),
    });
  }

  return blocks;
}

/**
 * Create a valid landslide data response with current timestamp and future expiry
 */
export function createValidLandslideData(
  overrides: Partial<MockLandslideData> = {},
): MockLandslideData {
  const now = new Date();
  const futureExpiry = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  return {
    community: {
      alt_name: "Sháan Séet",
      country: "US",
      id: "AK91",
      is_coastal: 1,
      name: "Craig",
      latitude: 55.4764,
      longitude: -133.148,
      ocean_lat1: 55.5688,
      ocean_lon1: -133.2313,
      region: "Alaska",
      tags: "ardac,awe,eds",
      type: "community",
    },
    expires_at: futureExpiry.toISOString(),
    forecast_blocks: generateForecastBlocks(now),
    gauge_id: "CRGA2",
    place_id: "AK91",
    place_name: "Craig",
    realtime_antecedent_mm: "7.62",
    realtime_rainfall_mm: "0.508",
    realtime_risk_level: 0,
    realtime_threshold_upper: "12.648245515533398",
    timestamp: now.toISOString(),
    // Legacy fields for backward compatibility
    precipitation_24hr: 10.5,
    precipitation_2days: 25.2,
    precipitation_3days: 45.8,
    precipitation_inches: 1.8,
    precipitation_mm: 45.8,
    risk_24hr: 0,
    risk_2days: 1,
    risk_3days: 2,
    risk_level: 1,
    ...overrides,
  };
}

/**
 * Mock API responses for landslide data
 */
export class ApiMocker {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Setup global API mocks to prevent real API calls during SSR/hydration
   */
  async setupGlobalMocks() {
    // Mock all possible community endpoints to prevent any real API calls
    const communities = ["AK91", "AK182", "CRAIG", "NENANA"];

    for (const community of communities) {
      await this.page.route(
        `**/landslide/${community}`,
        async (route: Route) => {
          const response = createValidLandslideData();
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(response),
          });
        },
      );
    }
  }

  /**
   * Mock successful API response
   */
  async mockSuccessfulResponse(
    community: string,
    data?: Partial<MockLandslideData>,
  ) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      const response = createValidLandslideData(data);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Mock API server error
   */
  async mockServerError(community: string, status: number = 500) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });
  }

  /**
   * Mock response with error_code 409 indicating data is out of sync
   */
  async mockOutOfSyncResponse(community: string) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      // Return actual HTTP 409 status to match how the application detects stale data
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Data is stale",
          message: "The data is currently out of sync",
        }),
      });
    });
  }

  /**
   * Mock a slow/hanging API response for timeout testing
   */
  async mockSlowResponse(community: string) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      // Don't fulfill the route - let it hang to simulate a slow response
      // This will be used with page.clock to test timeouts
    });
  }
}

/**
 * Valid community IDs for testing
 */
export const TEST_COMMUNITIES = {
  CRAIG: "AK91",
  KASAAN: "AK182",
} as const;
