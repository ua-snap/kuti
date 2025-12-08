import { Page, Route } from "@playwright/test";

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
      // Create a timestamp from 4 hours ago to simulate stale data
      const staleTimestamp = new Date(Date.now() - 4 * 60 * 60 * 1000);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          error_code: 409,
          error_msg: "Data is stale",
          timestamp: staleTimestamp.toISOString(),
        }),
      });
    });
  }
}

/**
 * Test utilities for common operations
 */
export class TestUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific community page
   */
  async navigateToCommunity(community: string) {
    await this.page.goto(`/${community}`);
  }

  /**
   * Wait for the data loading to complete
   */
  async waitForDataLoad() {
    // Wait for any loading spinners to disappear and data to load
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for error message to appear
   */
  async waitForError(expectedError?: string, timeout: number = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await this.isErrorDisplayed(expectedError)) {
        return true;
      }
      await this.page.waitForTimeout(100);
    }
    return false;
  }

  /**
   * Check if an error message is displayed
   */
  async isErrorDisplayed(expectedError?: string) {
    // Look for the specific error messages that our tests can generate
    const errorSelectors = [
      'p:has-text("The data is out of sync")',
      'p:has-text("Unable to format the data from the database")',
      'p:has-text("The database is currently inaccessible")',
    ];

    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector).first();

      if (await errorElement.isVisible()) {
        if (expectedError) {
          const errorText = await errorElement.textContent();
          if (errorText?.includes(expectedError)) {
            return true;
          }
        } else {
          return true;
        }
      }
    }

    // If looking for specific error, check if it exists anywhere on page
    if (expectedError) {
      const specificError = this.page.locator(`text=${expectedError}`).first();
      if (await specificError.isVisible()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if loading state is displayed
   */
  async isLoading() {
    // Look for the actual loading text that appears in the app
    const loadingText = this.page
      .locator('text="Loading landslide risk data..."')
      .first();
    return await loadingText.isVisible();
  }
}

/**
 * Valid community IDs for testing
 */
export const TEST_COMMUNITIES = {
  CRAIG: "AK91",
  KASAAN: "AK182",
} as const;
