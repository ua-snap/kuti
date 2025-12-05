import { test, expect } from "@playwright/test";
import {
  ApiMocker,
  TestUtils,
  TEST_COMMUNITIES,
  createExpiredLandslideData,
} from "./utils";

test.describe("Expired Data Scenarios", () => {
  let apiMocker: ApiMocker;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    testUtils = new TestUtils(page);
  });

  test("should display error when API returns expired data", async ({
    page,
  }) => {
    const expiredData = createExpiredLandslideData();

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that error message is displayed
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    expect(
      await testUtils.isErrorDisplayed(
        "upstream data sources were unable to be updated",
      ),
    ).toBeTruthy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // Verify that no current data is displayed (data should be null when expired)
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toBeFalsy();
  });

  test("should show time since last update in expired data error", async ({
    page,
  }) => {
    const expiredData = createExpiredLandslideData();

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to appear and check it contains time information
    await testUtils.waitForError("since the last update");

    // Get error text using the page content (since error is displayed as paragraph)
    const errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();

    expect(errorText).toMatch(/(minutes?|hours?|days?)/);
  });

  test("should handle data that just expired (1 minute ago)", async ({
    page,
  }) => {
    const now = new Date();
    const justExpired = new Date(now.getTime() - 1 * 60 * 1000); // 1 minute ago
    const expiredData = createExpiredLandslideData({
      expires_at: justExpired.toISOString(),
      timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to appear and check it contains minute information
    await testUtils.waitForError("since the last update");

    // Get error text using the page content
    const errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/minutes?/);
  });

  test("should handle data that expired hours ago", async ({ page }) => {
    const now = new Date();
    const hoursAgoExpiry = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
    const expiredData = createExpiredLandslideData({
      expires_at: hoursAgoExpiry.toISOString(),
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to appear and check it contains hour information
    await testUtils.waitForError("since the last update");

    // Get error text using the page content
    const errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/hours?/);
  });

  test("should handle data that expired days ago", async ({ page }) => {
    const now = new Date();
    const daysAgoExpiry = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const expiredData = createExpiredLandslideData({
      expires_at: daysAgoExpiry.toISOString(),
      timestamp: new Date(
        now.getTime() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 3 days ago
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to appear and check it contains day information
    await testUtils.waitForError("since the last update");

    // Get error text using the page content
    const errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/days?/);
  });

  test("should handle different expiry times for different communities", async ({
    page,
  }) => {
    const now = new Date();

    // Craig data expired 1 hour ago
    const craigExpiredData = createExpiredLandslideData({
      expires_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    });

    // Kasaan data expired 1 day ago
    const kasaanExpiredData = createExpiredLandslideData({
      expires_at: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      timestamp: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    await apiMocker.mockExpiredResponse(
      TEST_COMMUNITIES.CRAIG,
      craigExpiredData,
    );
    await apiMocker.mockExpiredResponse(
      TEST_COMMUNITIES.KASAAN,
      kasaanExpiredData,
    );

    // Test Craig (hours)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();
    await testUtils.waitForError("since the last update");

    let errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/hours?/);

    // Test Kasaan (days)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();
    await testUtils.waitForError("since the last update");

    errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/days?/);
  });

  test("should maintain map functionality despite expired data", async ({
    page,
  }) => {
    const expiredData = createExpiredLandslideData();

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Even with expired data, map should still be visible
    expect(await testUtils.isMapVisible()).toBeTruthy();

    // Check that page title and community name are still correct
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle transition from valid to expired data", async ({
    page,
  }) => {
    // First, mock valid data
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify valid data is shown
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();
    const initialRiskText = await testUtils.getCurrentRiskLevel();
    expect(initialRiskText).toBeTruthy();

    // Navigate away
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Now mock expired data
    await apiMocker.clearMocks();
    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG);

    // Navigate back
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Verify expired data error is shown
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    expect(
      await testUtils.isErrorDisplayed(
        "upstream data sources were unable to be updated",
      ),
    ).toBeTruthy();

    // Verify old data is cleared
    const newRiskText = await testUtils.getCurrentRiskLevel();
    expect(newRiskText).toBeFalsy();
  });

  test("should handle edge case: expires_at exactly equals current time", async ({
    page,
  }) => {
    const now = new Date();
    const expiredData = createExpiredLandslideData({
      expires_at: now.toISOString(), // Expires exactly now
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Since now > expiresAt check is used, exact equality should still be considered expired
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
  });

  test('should show "Just now" for very recent updates', async ({ page }) => {
    const now = new Date();
    const expiredData = createExpiredLandslideData({
      expires_at: new Date(now.getTime() - 30 * 1000).toISOString(), // 30 seconds ago
      timestamp: new Date(now.getTime() - 45 * 1000).toISOString(), // 45 seconds ago
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Wait for error to appear and check it shows "Just now"
    await testUtils.waitForError("since the last update");

    // Get error text using the page content
    const errorText = await page
      .locator('p:has-text("upstream data sources were unable to be updated")')
      .textContent();
    expect(errorText).toMatch(/Just now/);
  });

  test("should handle malformed timestamp in expired data", async ({
    page,
  }) => {
    const expiredData = createExpiredLandslideData({
      timestamp: "invalid-timestamp", // Malformed timestamp
    });

    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG, expiredData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
    // Should still show error even with malformed timestamp
  });

  test("should handle malformed expires_at in data", async ({ page }) => {
    const mockData = {
      expires_at: "invalid-date-format",
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
      timestamp: new Date().toISOString(),
    };

    await page.route(
      `**/landslide/${TEST_COMMUNITIES.CRAIG}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockData),
        });
      },
    );

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Should handle malformed expires_at gracefully
    await testUtils.waitForError();
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();
  });

  test("should clear error when navigating from expired to valid data", async ({
    page,
  }) => {
    // Start with expired data
    await apiMocker.mockExpiredResponse(TEST_COMMUNITIES.CRAIG);
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.KASAAN);

    // Navigate to Craig (expired)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();
    expect(await testUtils.isErrorDisplayed()).toBeTruthy();

    // Navigate to Kasaan (valid)
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();

    // Error should be cleared and valid data shown
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toBeTruthy();
  });
});
