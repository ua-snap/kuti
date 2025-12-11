import { test, expect } from "@playwright/test";
import {
  ApiMocker,
  TestUtils,
  TEST_COMMUNITIES,
  createValidLandslideData,
} from "./utils";

test.describe("Error Handling Test Suite", () => {
  let apiMocker: ApiMocker;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    // Set up global mocks to prevent real API calls during SSR/hydration
    await apiMocker.setupGlobalMocks();
  });

  test("should display 'The data is out of sync' for error_code 409 in response body", async ({
    page,
  }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 409);
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    await expect(page.locator(".async-finished")).toBeVisible();

    expect(page.locator(".http-error")).toBeVisible();
    expect(page.locator(".stale-data")).toBeVisible();
    expect(page.locator("h1")).not.toBeVisible(); // No title
    expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    expect(page.locator("#map")).not.toBeVisible(); // No map
  });

  test("should display general error for HTTP 500 status", async ({ page }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 500);
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    await expect(page.locator(".async-finished")).toBeVisible();

    expect(page.locator(".http-error")).toBeVisible();
    expect(page.locator(".general-error")).toBeVisible();
    expect(page.locator("h1")).not.toBeVisible(); // No title
    expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    expect(page.locator("#map")).not.toBeVisible(); // No map
  });

  test("should display database inaccessible error for HTTP 502 status", async ({
    page,
  }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 502);
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    await expect(page.locator(".async-finished")).toBeVisible();

    expect(page.locator(".http-error")).toBeVisible();
    expect(page.locator(".database-inaccessible")).toBeVisible();
    expect(page.locator("h1")).not.toBeVisible(); // No title
    expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    expect(page.locator("#map")).not.toBeVisible(); // No map
  });

  test("should display valid data for successful API response", async ({
    page,
  }) => {
    const validData = createValidLandslideData({
      precipitation_inches: 2.5,
      risk_level: 1, // Medium risk
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, validData);
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    await expect(page.locator(".async-finished")).toBeVisible();

    // No HTTP error block, no error block, and response matches (mock) API result
    expect(page.locator(".http-error")).toBeHidden();
    expect(page.locator(".async-loading")).toBeHidden();
    expect(page.locator('text=/2\.50\"/')).toBeVisible();
    expect(page.locator("text=/Medium risk of landslide now/")).toBeVisible();
  });
});
