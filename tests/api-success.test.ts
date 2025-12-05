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
    await expect(
      page.locator("p").filter({ hasText: /Precipitation:.*1\.0/ }),
    ).toBeVisible();

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
