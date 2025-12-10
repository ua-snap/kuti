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
    testUtils = new TestUtils(page);

    // Set up global mocks to prevent real API calls during SSR/hydration
    await apiMocker.setupGlobalMocks();
  });

  test("should display 'The data is out of sync' for error_code 409 in response body", async ({
    page,
  }) => {
    await apiMocker.mockOutOfSyncResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(
      await testUtils.waitForError(
        "The landslide risk data is currently stale",
      ),
    ).toBeTruthy();

    expect(await testUtils.isLoading()).toBeFalsy();

    await expect(page.locator('text="Switch Location"')).toBeVisible();
  });

  test("should display database formatting error for HTTP 500 status", async ({
    page,
  }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 500);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(
      await testUtils.waitForError(
        "An unexpected error occurred while fetching landslide risk data",
      ),
    ).toBeTruthy();

    expect(await testUtils.isLoading()).toBeFalsy();

    await expect(page.locator("h1")).not.toBeVisible(); // No title
    await expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    await expect(page.locator("#map")).not.toBeVisible(); // No map

    await expect(
      page.locator(
        'p:has-text("An unexpected error occurred while fetching landslide risk data")',
      ),
    ).toBeVisible();
  });

  test("should display database inaccessible error for HTTP 502 status", async ({
    page,
  }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 502);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(
      await testUtils.waitForError("The database is currently inaccessible"),
    ).toBeTruthy();

    expect(await testUtils.isLoading()).toBeFalsy();

    await expect(page.locator("h1")).not.toBeVisible(); // No title
    await expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    await expect(page.locator("#map")).not.toBeVisible(); // No map

    await expect(
      page.locator('p:has-text("The database is currently inaccessible")'),
    ).toBeVisible();
  });

  test("should display valid data for successful API response", async ({
    page,
  }) => {
    const validData = createValidLandslideData({
      precipitation_inches: 2.5,
      risk_level: 1, // Medium risk
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, validData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(await testUtils.isErrorDisplayed()).toBeFalsy();

    expect(await testUtils.isLoading()).toBeFalsy();

    await expect(page.locator('text="')).toBeVisible();

    await expect(page.locator('text=/2.5.*"/')).toBeVisible();

    await expect(
      page.locator("text=/Medium risk of landslide now/"),
    ).toBeVisible();
  });
});
