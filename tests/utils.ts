import { Page, Route, expect } from "@playwright/test";

export interface MockLandslideData {
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
  risk_is_elevated_from_previous: boolean;
  risk_level: number;
  risk_probability: number;
  timestamp: string;
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
      name: "Craig",
      latitude: 55.4764,
      longitude: -133.148,
    },
    expires_at: futureExpiry.toISOString(),
    precipitation_24hr: 10.5,
    precipitation_2days: 25.2,
    precipitation_3days: 45.8,
    precipitation_inches: 1.8,
    precipitation_mm: 45.8,
    risk_24hr: 0,
    risk_2days: 1,
    risk_3days: 2,
    risk_level: 1,
    timestamp: now.toISOString(),
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
}

/**
 * Valid community IDs for testing
 */
export const TEST_COMMUNITIES = {
  CRAIG: "AK91",
  KASAAN: "AK182",
} as const;
