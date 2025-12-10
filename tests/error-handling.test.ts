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
  });

  test("should display 'The data is out of sync' for error_code 409 in response body", async ({
    page,
  }) => {
    // Mock 200 response with error_code: 409 in the body
    await apiMocker.mockOutOfSyncResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify the specific error message is displayed
    expect(
      await testUtils.waitForError(
        "The landslide risk data is currently stale",
      ),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // Verify that Switch Location link is still visible (error state still shows navigation)
    await expect(page.locator('text="Switch Location"')).toBeVisible();
  });

  test("should display database formatting error for HTTP 500 status", async ({
    page,
  }) => {
    // Mock actual HTTP 500 error
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 500);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify the specific error message is displayed
    expect(
      await testUtils.waitForError(
        "An unexpected error occurred while fetching landslide risk data",
      ),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // For errors, verify that error message is shown along with navigation
    await expect(page.locator("h1")).not.toBeVisible(); // No title
    await expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    await expect(page.locator("#map")).not.toBeVisible(); // No map

    // Verify error message is visible
    await expect(
      page.locator(
        'p:has-text("An unexpected error occurred while fetching landslide risk data")',
      ),
    ).toBeVisible();
  });

  test("should display database inaccessible error for HTTP 502 status", async ({
    page,
  }) => {
    // Mock actual HTTP 502 error
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 502);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify the specific error message is displayed
    expect(
      await testUtils.waitForError("The database is currently inaccessible"),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // For errors, verify that error message is shown along with navigation
    await expect(page.locator("h1")).not.toBeVisible(); // No title
    await expect(page.locator('text="Switch Location"')).toBeVisible(); // Switch link is visible
    await expect(page.locator("#map")).not.toBeVisible(); // No map

    // Verify error message is visible
    await expect(
      page.locator('p:has-text("The database is currently inaccessible")'),
    ).toBeVisible();
  });

  test("should display valid data for successful API response", async ({
    page,
  }) => {
    // Mock successful response with valid data
    const validData = createValidLandslideData({
      precipitation_inches: 2.5,
      risk_level: 1, // Medium risk
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, validData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify no error is displayed
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // Verify that data is displayed
    await expect(page.locator('text="')).toBeVisible();

    // Verify specific precipitation values are displayed
    await expect(page.locator('text=/2.5.*"/')).toBeVisible();

    // Verify risk level is displayed
    await expect(
      page.locator("text=/Medium risk of landslide now/"),
    ).toBeVisible();
  });
});
