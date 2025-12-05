import { Page, Route } from "@playwright/test";

export interface MockLandslideData {
  expires_at: string;
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
  timestamp: string;
}

/**
 * Create a valid landslide data response with current timestamp and future expiry
 */
export function createValidLandslideData(
  overrides: Partial<MockLandslideData> = {},
): MockLandslideData {
  const now = new Date();
  const futureExpiry = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now

  return {
    expires_at: futureExpiry.toISOString(),
    precipitation_24hr: 10.5,
    precipitation_2days: 25.2,
    precipitation_3days: 45.8,
    precipitation_inches: 1.8,
    precipitation_mm: 45.8,
    risk_24hr: 0,
    risk_2days: 1,
    risk_3days: 2,
    risk_is_elevated_from_previous: true,
    risk_level: 1,
    timestamp: now.toISOString(),
    ...overrides,
  };
}

/**
 * Create an expired landslide data response
 */
export function createExpiredLandslideData(
  overrides: Partial<MockLandslideData> = {},
): MockLandslideData {
  const pastTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  const pastExpiry = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago

  return {
    ...createValidLandslideData(),
    expires_at: pastExpiry.toISOString(),
    timestamp: pastTime.toISOString(),
    ...overrides, // Apply overrides AFTER setting the expired defaults
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
   * Mock expired API response
   */
  async mockExpiredResponse(
    community: string,
    data?: Partial<MockLandslideData>,
  ) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      // If full data is provided, use it directly, otherwise create expired data
      const response =
        data && "expires_at" in data
          ? { ...createValidLandslideData(), ...data }
          : createExpiredLandslideData(data);
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
   * Mock network failure
   */
  async mockNetworkFailure(community: string) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      await route.abort();
    });
  }

  /**
   * Mock invalid JSON response
   */
  async mockInvalidResponse(community: string) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "invalid json response",
      });
    });
  }

  /**
   * Mock slow response
   */
  async mockSlowResponse(
    community: string,
    delayMs: number = 5000,
    data?: Partial<MockLandslideData>,
  ) {
    await this.page.route(`**/landslide/${community}`, async (route: Route) => {
      const response = createValidLandslideData(data);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Clear all route mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
  }
}

/**
 * Common test utilities
 */
export class TestUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the app to finish loading
   */
  async waitForAppToLoad() {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState("domcontentloaded");

    // Wait for Vue to mount (look for any Vue-specific attributes or content)
    await this.page.waitForFunction(
      () => {
        // Check if page has basic content loaded (looking for main heading or navigation)
        return (
          document.querySelector("h1, nav, [data-testid], .nuxt-app") !== null
        );
      },
      {},
      { timeout: 10000 },
    );

    // Small delay to ensure any immediate hydration is complete
    await this.page.waitForTimeout(100);
  }

  /**
   * Navigate to a community page and wait for it to load
   */
  async navigateToCommunity(community: string) {
    await this.page.goto(`/${community}`);
    await this.waitForAppToLoad();
  }

  /**
   * Wait for error to be displayed, with retries for timing issues
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
    // Look for error in multiple ways:
    // 1. Test IDs (if added later)
    // 2. Common error classes
    // 3. Text content that indicates errors
    const errorSelectors = [
      '[data-testid="error-message"]',
      ".error",
      ".alert-error",
      'p:has-text("Failed to fetch")',
      'p:has-text("unable to be updated")',
      'p:has-text("Invalid community")',
      'p:has-text("Network error occurred")',
      'p:has-text("data received from the server is corrupted")',
      'div:has(p:has-text("Failed to fetch"))',
      'div:has(p:has-text("unable to be updated"))',
      'div:has(p:has-text("Network error occurred"))',
      'div:has(p:has-text("data received from the server is corrupted"))',
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

    // Fallback: look for any text that suggests an error
    if (!expectedError) {
      const errorTexts = [
        "Failed to fetch landslide data",
        "upstream data sources were unable to be updated",
        "Invalid community selected",
        "data received from the server is corrupted",
        "Network error occurred while fetching data",
      ];

      for (const text of errorTexts) {
        const textElement = this.page.locator(`text=${text}`).first();
        if (await textElement.isVisible()) {
          return true;
        }
      }
    } else {
      // If looking for specific error, check if it exists anywhere on page
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
    return await this.page
      .locator('[data-testid="loading"], .loading')
      .first()
      .isVisible();
  }

  /**
   * Wait for data to load (loading disappears)
   */
  async waitForDataLoad(timeout: number = 10000) {
    // First wait for any loading indicators to disappear
    await this.page.waitForFunction(
      () => {
        const loadingElement = document.querySelector(
          '[data-testid="loading"], .loading',
        );
        return !loadingElement || !(loadingElement as HTMLElement).offsetParent;
      },
      {},
      { timeout },
    );

    // Add a small delay to ensure the app has time to process the API response
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for successful data to load and be displayed
   */
  async waitForDataSuccess(timeout: number = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const riskLevel = await this.getCurrentRiskLevel();
      const hasError = await this.isErrorDisplayed();

      if (riskLevel && !hasError) {
        return true;
      }
      await this.page.waitForTimeout(100);
    }
    return false;
  }

  /**
   * Get the current risk level displayed
   */
  async getCurrentRiskLevel() {
    // Wait a moment for page to stabilize
    await this.page.waitForTimeout(200);

    // Try to find any h2 elements that contain risk level info
    const allH2s = await this.page.locator("h2").all();

    for (const h2 of allH2s) {
      const text = await h2.textContent();
      if (text && text.includes("risk of landslide now")) {
        return text;
      }
    }

    // Fallback: try specific selectors
    const fallbackSelectors = [
      '[data-testid="risk-level"]',
      ".risk-level",
      'text="Low risk of landslide now"',
      'text="Medium risk of landslide now"',
      'text="High risk of landslide now"',
    ];

    for (const selector of fallbackSelectors) {
      const element = this.page.locator(selector).first();
      if (await element.isVisible()) {
        return await element.textContent();
      }
    }

    return null;
  }

  /**
   * Check if the map is loaded and visible
   */
  async isMapVisible() {
    return await this.page.locator("#map").isVisible();
  }
}

/**
 * Valid community IDs for testing
 */
export const TEST_COMMUNITIES = {
  CRAIG: "AK91",
  KASAAN: "AK182",
} as const;

/**
 * Risk level mappings
 */
export const RISK_LEVELS = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
} as const;
