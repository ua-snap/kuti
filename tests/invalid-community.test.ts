import { test, expect } from "@playwright/test";
import { TestUtils } from "./utils";

test.describe("Invalid Community and Edge Cases", () => {
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new TestUtils(page);
  });

  test("should handle invalid community ID gracefully", async ({ page }) => {
    // Try to navigate to an invalid community
    await page.goto("/INVALID123");

    // Should redirect or show 404/error page
    // Based on the definePageMeta validation in [community].vue
    await expect(page.url()).not.toContain("/INVALID123");

    // Should likely end up on a 404 page or redirect to home
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle empty community parameter", async ({ page }) => {
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Verify we're on the homepage
    await expect(page.locator("h1")).toContainText(
      "Landslide Risk for Alaskan Communities",
    );
  });

  test("should handle community ID with wrong case", async ({ page }) => {
    // Try lowercase version of valid ID
    await page.goto("/ak91");

    // Should not match the validation (case sensitive)
    await expect(page.url()).not.toContain("/ak91");

    // Should show error or redirect
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle community ID with extra characters", async ({ page }) => {
    await page.goto("/AK91extra");

    // Should not match validation
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle special characters in community parameter", async ({
    page,
  }) => {
    await page.goto("/AK91%20test");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle SQL injection attempt in community parameter", async ({
    page,
  }) => {
    await page.goto("/AK91'; DROP TABLE users; --");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle very long community parameter", async ({ page }) => {
    const longParam = "A".repeat(1000);
    await page.goto(`/${longParam}`);

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle numeric community parameter", async ({ page }) => {
    await page.goto("/123");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle valid community with trailing slash", async ({
    page,
  }) => {
    await page.goto("/AK91/");
    await testUtils.waitForAppToLoad();

    // Should work fine with trailing slash
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle valid community with query parameters", async ({
    page,
  }) => {
    await page.goto("/AK91?test=123&foo=bar");
    await testUtils.waitForAppToLoad();

    // Should ignore query params and work normally
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle valid community with hash fragment", async ({ page }) => {
    await page.goto("/AK91#section1");
    await testUtils.waitForAppToLoad();

    // Should ignore hash and work normally
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle rapid navigation to invalid communities", async ({
    page,
  }) => {
    // Try multiple invalid communities quickly
    await page.goto("/INVALID1");
    await page.goto("/INVALID2");
    await page.goto("/INVALID3");

    // Should handle gracefully without crashing
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle navigation from valid to invalid community", async ({
    page,
  }) => {
    // Start with valid community
    await testUtils.navigateToCommunity("AK91");
    await expect(page.locator("h1")).toContainText("Craig, Alaska");

    // Navigate to invalid community
    await page.goto("/INVALID");

    // Should handle gracefully
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle browser back/forward with invalid communities", async ({
    page,
  }) => {
    // Start on homepage
    await page.goto("/");
    await testUtils.waitForAppToLoad();

    // Go to valid community
    await testUtils.navigateToCommunity("AK91");

    // Try invalid community
    await page.goto("/INVALID");

    // Use browser back
    await page.goBack();

    // Should be back on valid community
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle Unicode characters in community parameter", async ({
    page,
  }) => {
    await page.goto("/AK🏔️91");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle URL encoded community parameter", async ({ page }) => {
    // %41%4B%39%31 is URL encoded "AK91"
    await page.goto("/%41%4B%39%31");
    await testUtils.waitForAppToLoad();

    // This should actually work since it decodes to AK91
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle multiple slashes in URL", async ({ page }) => {
    await page.goto("//AK91");

    // Should handle gracefully
    const pageWorked = await page
      .locator('h1:has-text("Craig, Alaska")')
      .isVisible();
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(pageWorked || is404 || isHomepage).toBeTruthy();
  });

  test("should validate communities before API call", async ({ page }) => {
    // Mock the API to ensure it doesn't get called for invalid communities
    let apiCalled = false;

    await page.route("**/landslide/**", async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    });

    await page.goto("/INVALID");

    // Wait a moment to see if API gets called
    await page.waitForTimeout(1000);

    // API should not be called for invalid communities
    expect(apiCalled).toBeFalsy();
  });

  test("should handle direct access to nested invalid routes", async ({
    page,
  }) => {
    await page.goto("/AK91/invalid/nested/route");

    // Should show 404 or redirect
    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const validCommunityPage = await page
      .locator('h1:has-text("Craig, Alaska")')
      .isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || validCommunityPage || isHomepage).toBeTruthy();
  });

  test("should maintain app state when encountering invalid routes", async ({
    page,
  }) => {
    // Navigate to valid community first
    await testUtils.navigateToCommunity("AK91");
    await testUtils.waitForAppToLoad();

    // Try invalid route
    await page.goto("/INVALID");

    // Navigate back to valid route
    await testUtils.navigateToCommunity("AK182");

    // App should still work normally
    await expect(page.locator("h1")).toContainText("Kasaan, Alaska");

    // Map should still work
    expect(await testUtils.isMapVisible()).toBeTruthy();
  });

  test("should handle case sensitivity correctly", async ({ page }) => {
    // Test all possible case variations
    const invalidCases = ["ak91", "Ak91", "aK91", "AK91"];

    for (const testCase of ["ak91", "Ak91", "aK91"]) {
      await page.goto(`/${testCase}`);

      const is404 = await page.locator("text=/404|Not Found/i").isVisible();
      const isHomepage = page.url().endsWith("/");

      // Only exact case "AK91" should work
      expect(is404 || isHomepage).toBeTruthy();
    }

    // Test that correct case works
    await testUtils.navigateToCommunity("AK91");
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });

  test("should handle partial community IDs", async ({ page }) => {
    await page.goto("/AK");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");

    expect(is404 || isHomepage).toBeTruthy();
  });

  test("should handle community ID with leading/trailing spaces", async ({
    page,
  }) => {
    // Note: URLs typically trim spaces, but test anyway
    await page.goto("/ AK91 ");

    const is404 = await page.locator("text=/404|Not Found/i").isVisible();
    const isHomepage = page.url().endsWith("/");
    const workedAnyway = await page
      .locator('h1:has-text("Craig, Alaska")')
      .isVisible();

    // Should either work or show appropriate error
    expect(is404 || isHomepage || workedAnyway).toBeTruthy();
  });
});
