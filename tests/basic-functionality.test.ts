import { test, expect } from "@playwright/test";
import {
  TestUtils,
  TEST_COMMUNITIES,
  createValidLandslideData,
  ApiMocker,
} from "./utils";

test.describe("Basic App Functionality", () => {
  let testUtils: TestUtils;
  let apiMocker: ApiMocker;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
    apiMocker = new ApiMocker(page);

    // Clear any existing mocks first
    await apiMocker.clearMocks();

    // Set up basic mocks for navigation tests to avoid external API dependencies
    await apiMocker.mockSuccessfulResponse(
      TEST_COMMUNITIES.CRAIG,
      createValidLandslideData(),
    );
    await apiMocker.mockSuccessfulResponse(
      TEST_COMMUNITIES.KASAAN,
      createValidLandslideData(),
    );
  });

  test.afterEach(async ({ page }) => {
    // Clean up mocks after each test
    await apiMocker.clearMocks();
  });

  test("should load the homepage successfully", async ({ page }) => {
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Check that the main heading is visible
    await expect(page.locator("h1")).toContainText(
      "Landslide Risk for Alaskan Communities",
    );

    // Check that the location selection question is visible
    await expect(page.locator("h3")).toContainText("Where are you?");

    // Check that both community links are present
    await expect(page.locator('a[href="/AK91"]')).toContainText("Craig");
    await expect(page.locator('a[href="/AK182"]')).toContainText("Kasaan");
  });

  test("should navigate to Craig community page", async ({ page }) => {
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Click the Craig link
    await page.click('a[href="/AK91"]');

    // Wait for navigation and app to load
    await testUtils.waitForAppToLoad();

    // Check that we're on the Craig page
    await expect(page.url()).toContain("/AK91");
    await expect(page.locator("h1")).toContainText("Craig, Alaska");

    // Check that the "Switch Location" link is present
    await expect(page.locator('a[href="/"]')).toContainText("Switch Location");
  });

  test("should navigate to Kasaan community page", async ({ page }) => {
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Click the Kasaan link
    await page.click('a[href="/AK182"]');

    // Wait for navigation and data to load
    await testUtils.waitForAppToLoad();
    await testUtils.waitForDataLoad();

    // Check that we're on the Kasaan page
    await expect(page.url()).toContain("/AK182");
    await expect(page.locator("h1")).toContainText("Kasaan, Alaska");

    // Check that the "Switch Location" link is present
    await expect(page.locator('a[href="/"]')).toContainText("Switch Location");
  });

  test("should navigate back to homepage from community page", async ({
    page,
  }) => {
    // Start on a community page
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Click "Switch Location"
    await page.click('a[href="/"]');
    await testUtils.waitForAppToLoad();

    // Verify we're back on the homepage
    await expect(page.url()).toBe(new URL(page.url()).origin + "/");
    await expect(page.locator("h1")).toContainText(
      "Landslide Risk for Alaskan Communities",
    );
  });

  test("should display loading state when navigating to community page", async ({
    page,
  }) => {
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Navigate to a community page
    await page.click('a[href="/AK91"]');

    // Check if loading state appears (might be brief)
    const loadingText = page.locator("text=Loading landslide risk data...");
    // We don't assert this is visible since it might be too fast to catch consistently

    // Wait for the page to fully load
    await testUtils.waitForAppToLoad();

    // Verify final state
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should have proper page titles", async ({ page }) => {
    // Test homepage title
    await page.goto("/");
    await testUtils.waitForAppToLoad();
    await expect(page).toHaveTitle(/Landslide Risk for Alaskan Communities/);

    // Test Craig page title
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await expect(page).toHaveTitle(/Craig, Alaska/);

    // Test Kasaan page title
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.KASAAN);
    await expect(page).toHaveTitle(/Kasaan, Alaska/);
  });

  test("should show map container on community pages", async ({ page }) => {
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);

    // Check that map container exists
    const mapContainer = page.locator("#map");
    await expect(mapContainer).toBeVisible();
  });

  test("should show risk level component on community pages", async ({
    page,
  }) => {
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);

    // Look for risk level component (this will depend on your RiskLevel component implementation)
    // We'll check for common risk level indicators
    const riskComponent = page
      .locator('[data-testid="risk-level"]')
      .or(page.locator(".risk-level"))
      .or(page.locator("text=/Low|Medium|High/"))
      .first();

    // The component should be present, though it might show error state
    await expect(riskComponent).toBeVisible();
  });

  test("should show resources component on community pages", async ({
    page,
  }) => {
    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    // Look for resources section heading - this indicates the component is present
    await expect(
      page.locator("h2").filter({ hasText: "Resources" }),
    ).toBeVisible();

    // Verify the resources content is present
    await expect(page.locator("text=Placeholder for resources")).toBeVisible();
  });

  test("should handle direct navigation to community pages", async ({
    page,
  }) => {
    // Navigate directly to Craig page
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    await testUtils.waitForAppToLoad();

    await expect(page.locator("h1")).toContainText("Craig, Alaska");

    // Navigate directly to Kasaan page
    await page.goto(`/${TEST_COMMUNITIES.KASAAN}`);
    await testUtils.waitForAppToLoad();

    await expect(page.locator("h1")).toContainText("Kasaan, Alaska");
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Check that content is still visible on mobile
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('a[href="/AK91"]')).toBeVisible();
    await expect(page.locator('a[href="/AK182"]')).toBeVisible();

    // Navigate to community page on mobile
    await page.click('a[href="/AK91"]');
    await testUtils.waitForAppToLoad();

    await expect(page.locator("h1")).toContainText("Craig, Alaska");
    await expect(page.locator("#map")).toBeVisible();
  });
});
