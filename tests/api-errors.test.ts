import { test, expect } from "@playwright/test";
import { ApiMocker, TestUtils, TEST_COMMUNITIES } from "./utils";

test.describe("API Error Conditions", () => {
  let apiMocker: ApiMocker;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    testUtils = new TestUtils(page);
  });

  test("should handle network failure gracefully", async ({ page }) => {
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Add a longer delay to allow error state to propagate properly
    await page.waitForTimeout(500);

    // Check that error message is displayed
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    expect(
      await testUtils.isErrorDisplayed(
        "Network error occurred while fetching data",
      ),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // Verify that no data is displayed
    await expect(page.locator("text=/inches|mm/")).not.toBeVisible();
  });

  test("should handle 500 server error", async ({ page }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 500);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to be displayed with retries
    expect(await testUtils.waitForError()).toBeTruthy();
    expect(
      await testUtils.waitForError("Failed to fetch landslide data"),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();
  });

  test("should handle 404 not found error", async ({ page }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 404);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to be displayed with retries
    expect(await testUtils.waitForError()).toBeTruthy();
    expect(
      await testUtils.waitForError("Failed to fetch landslide data"),
    ).toBeTruthy();
  });

  test("should handle 503 service unavailable error", async ({ page }) => {
    await apiMocker.mockServerError(TEST_COMMUNITIES.CRAIG, 503);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to be displayed with retries
    expect(await testUtils.waitForError()).toBeTruthy();
    expect(
      await testUtils.waitForError("Failed to fetch landslide data"),
    ).toBeTruthy();
  });

  test("should handle invalid JSON response", async ({ page }) => {
    await apiMocker.mockInvalidResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Give the error a moment to propagate to the UI
    await page.waitForTimeout(100);

    // Check that specific error message for corrupted data is displayed
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    expect(
      await testUtils.isErrorDisplayed(
        "data received from the server is corrupted",
      ),
    ).toBeTruthy();
  });

  test("should allow retry after error", async ({ page }) => {
    // First, mock a failure
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify error is shown
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();

    // Clear the mock and set up successful response
    await apiMocker.clearMocks();
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG);

    // Navigate away and back to trigger retry
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify success
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();
  });

  test("should handle different error types for different communities", async ({
    page,
  }) => {
    // Mock different errors for different communities
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);
    await apiMocker.mockServerError(TEST_COMMUNITIES.KASAAN, 500);

    // Test Craig (network failure)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();

    // Test Kasaan (server error)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
  });

  test("should handle API error and then successful navigation to different community", async ({
    page,
  }) => {
    // Mock error for Craig, success for Kasaan
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.KASAAN);

    // First try Craig (should fail)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Use robust error waiting for the first step
    expect(await testUtils.waitForError()).toBeTruthy();

    // Then try Kasaan (should succeed)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();

    // Wait for successful data to be displayed
    expect(await testUtils.waitForDataSuccess()).toBeTruthy();

    expect(await testUtils.isErrorDisplayed()).toBeFalsy();

    // Verify Kasaan data is displayed
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toBeTruthy();
  });

  test("should maintain map functionality despite API error", async ({
    page,
  }) => {
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Even with API error, map should still be visible
    expect(await testUtils.isMapVisible()).toBeTruthy();

    // Check that page title and community name are still correct
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should show appropriate error for empty response", async ({ page }) => {
    // Mock empty but valid JSON response
    await page.route(
      `**/landslide/${TEST_COMMUNITIES.CRAIG}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        });
      },
    );

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Should handle empty response gracefully
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
  });

  test("should handle malformed API URL gracefully", async ({ page }) => {
    // Mock an invalid URL response
    await page.route("**/landslide/**", async (route) => {
      await route.abort("internetdisconnected");
    });

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    expect(
      await testUtils.isErrorDisplayed(
        "Network error occurred while fetching data",
      ),
    ).toBeTruthy();
  });

  test("should handle CORS errors", async ({ page }) => {
    await page.route(
      `**/landslide/${TEST_COMMUNITIES.CRAIG}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: {
            // Missing CORS headers to simulate CORS error
          },
          body: JSON.stringify({}),
        });
      },
    );

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Should handle CORS-like issues
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
  });

  test("should clear previous data when new error occurs", async ({ page }) => {
    // First, mock successful response
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify data is loaded
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();

    // Navigate away
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Now mock an error
    await apiMocker.clearMocks();
    await apiMocker.mockNetworkFailure(TEST_COMMUNITIES.CRAIG);

    // Navigate back
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify error is shown and old data is cleared
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    await expect(page.locator("text=/inches|mm/")).not.toBeVisible();
  });
});
