import { test, expect } from "@playwright/test";
import {
  ApiMocker,
  TestUtils,
  TEST_COMMUNITIES,
  RISK_LEVELS,
  createValidLandslideData,
} from "./utils";

test.describe("API Success Scenarios", () => {
  let apiMocker: ApiMocker;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    testUtils = new TestUtils(page);
  });

  test("should display landslide data when API returns valid current data", async ({
    page,
  }) => {
    const mockData = createValidLandslideData({
      risk_level: RISK_LEVELS.MEDIUM,
      precipitation_inches: 2.5,
      precipitation_mm: 63.5,
      risk_is_elevated_from_previous: true,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);

    // Wait for data to load
    await testUtils.waitForDataLoad();

    // Check that no error is displayed
    expect(await testUtils.isErrorDisplayed()).toBeFalsy();

    // Check that loading is complete
    expect(await testUtils.isLoading()).toBeFalsy();

    // Check that precipitation data is displayed (look for the values in the page)
    await expect(page.locator("text=/2.5|63.5/")).toBeVisible();

    // Check that risk level is displayed
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("Medium");
  });

  test("should display low risk level correctly", async ({ page }) => {
    const mockData = createValidLandslideData({
      risk_level: RISK_LEVELS.LOW,
      precipitation_inches: 0.5,
      precipitation_mm: 12.7,
      risk_is_elevated_from_previous: false,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that risk level shows as Low
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("Low");

    // Check precipitation values
    await expect(page.locator("text=/0.5|12.7/")).toBeVisible();
  });

  test("should display high risk level correctly", async ({ page }) => {
    const mockData = createValidLandslideData({
      risk_level: RISK_LEVELS.HIGH,
      precipitation_inches: 5.0,
      precipitation_mm: 127.0,
      risk_is_elevated_from_previous: true,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that risk level shows as High
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("High");

    // Check precipitation values
    await expect(page.locator("text=/5.0|127.0/")).toBeVisible();
  });

  test("should handle different communities with different data", async ({
    page,
  }) => {
    // Mock different data for each community
    const craigData = createValidLandslideData({
      risk_level: RISK_LEVELS.LOW,
      precipitation_inches: 1.0,
      precipitation_mm: 25.4,
    });

    const kasaanData = createValidLandslideData({
      risk_level: RISK_LEVELS.HIGH,
      precipitation_inches: 4.0,
      precipitation_mm: 101.6,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, craigData);
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.KASAAN, kasaanData);

    // Test Craig first
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    let riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("Low");
    await expect(page.locator("text=/1.0|25.4/")).toBeVisible();

    // Navigate to Kasaan
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();

    riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("High");
    await expect(page.locator("text=/4.0|101.6/")).toBeVisible();
  });

  test("should display timestamp information when data is current", async ({
    page,
  }) => {
    const mockData = createValidLandslideData();

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check for timestamp display - look for "Last updated" text specifically
    await expect(
      page.locator("p").filter({ hasText: "Last updated" }),
    ).toBeVisible();
    await expect(
      page.locator("p").filter({ hasText: /ago|Just now/ }),
    ).toBeVisible();
  });

  test("should show elevated risk indicator when appropriate", async ({
    page,
  }) => {
    const mockData = createValidLandslideData({
      risk_is_elevated_from_previous: true,
      risk_level: RISK_LEVELS.MEDIUM,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Look for indicators of elevated risk (this depends on your RiskLevel component implementation)
    const elevatedIndicator = page
      .locator("text=/elevated|increased|rising|↑/i")
      .first();
    // Note: This test might need adjustment based on your actual UI implementation

    // We expect some visual indication of elevated risk
    await expect(elevatedIndicator).toBeVisible();
  });

  test("should display all precipitation time periods", async ({ page }) => {
    const mockData = createValidLandslideData({
      precipitation_24hr: 15.2,
      precipitation_2days: 28.7,
      precipitation_3days: 45.1,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that different time period headings are displayed
    await expect(
      page.locator("h3").filter({ hasText: "24 hour forecast" }),
    ).toBeVisible();
    await expect(
      page.locator("h3").filter({ hasText: "2-day precipitation" }),
    ).toBeVisible();
    await expect(
      page.locator("h3").filter({ hasText: "3-day precipitation" }),
    ).toBeVisible();

    // Check that the values are displayed
    await expect(page.locator("text=/15.2/")).toBeVisible();
    await expect(page.locator("text=/28.7/")).toBeVisible();
    await expect(page.locator("text=/45.1/")).toBeVisible();
  });

  test("should display both metric and imperial precipitation values", async ({
    page,
  }) => {
    const mockData = createValidLandslideData({
      precipitation_24hr: 88.9, // This is what gets displayed in the 24hr forecast
      precipitation_inches: 3.5,
      precipitation_mm: 88.9,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that both mm and inches values are displayed in the 24hr forecast
    // Format should be: "Precipitation: 88.9mm (3.50")"
    await expect(
      page.locator("p").filter({ hasText: "Precipitation:" }),
    ).toBeVisible();
    await expect(page.locator("text=/88.9mm/")).toBeVisible();
    await expect(page.locator("text=/3.50/")).toBeVisible(); // The inches value
  });

  test("should handle rapid navigation between communities", async ({
    page,
  }) => {
    const craigData = createValidLandslideData({ risk_level: RISK_LEVELS.LOW });
    const kasaanData = createValidLandslideData({
      risk_level: RISK_LEVELS.HIGH,
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, craigData);
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.KASAAN, kasaanData);

    // Navigate rapidly between communities
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await testUtils.waitForDataLoad();

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Ensure final state is correct
    const riskText = await testUtils.getCurrentRiskLevel();
    expect(riskText).toContain("Low");
  });

  test("should maintain map functionality with valid data", async ({
    page,
  }) => {
    const mockData = createValidLandslideData();

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, mockData);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Check that map is visible and initialized
    expect(await testUtils.isMapVisible()).toBeTruthy();

    // Check that map container has content (Leaflet adds classes)
    const mapContainer = page.locator("#map");
    await expect(mapContainer).toHaveClass(/leaflet-container/);
  });
});
