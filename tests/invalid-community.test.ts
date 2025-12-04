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
    await testUtils.waitForAppToLoad();

    // Should show 404 page with the invalid path
    // Use more flexible matching since the text might appear multiple times
    await expect(
      page.getByText("Page Not Found: /INVALID123").first(),
    ).toBeVisible();
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
    await testUtils.waitForAppToLoad();

    // Should show 404 page
    await expect(page.getByText("Page Not Found: /ak91").first()).toBeVisible();
  });

  test("should handle community ID with extra characters", async ({ page }) => {
    await page.goto("/AK91extra");
    await testUtils.waitForAppToLoad();

    // Should show 404 page
    await expect(
      page.getByText("Page Not Found: /AK91extra").first(),
    ).toBeVisible();
  });

  test("should handle special characters in community parameter", async ({
    page,
  }) => {
    await page.goto("/AK91%20test");
    await testUtils.waitForAppToLoad();

    // Should show 404 page with URL-encoded path
    // The path might show as decoded or encoded depending on Nuxt handling
    // Check for either the encoded or decoded version
    const hasEncodedPath = await page
      .getByText("Page Not Found: /AK91%20test")
      .first()
      .isVisible();
    const hasDecodedPath = await page
      .getByText("Page Not Found: /AK91 test")
      .first()
      .isVisible();

    expect(hasEncodedPath || hasDecodedPath).toBeTruthy();
  });

  test("should handle SQL injection attempt in community parameter", async ({
    page,
  }) => {
    const maliciousPath = "/AK91'; DROP TABLE users; --";
    await page.goto(maliciousPath);
    await testUtils.waitForAppToLoad();

    // Should show 404 page with the malicious path safely escaped
    // Look for the safe part of the path that should appear
    const pageNotFound = await page
      .getByText("Page Not Found: /AK91")
      .first()
      .isVisible();
    expect(pageNotFound).toBeTruthy();
  });

  test("should handle very long community parameter", async ({ page }) => {
    const longParam = "A".repeat(1000);
    await page.goto(`/${longParam}`);
    await testUtils.waitForAppToLoad();

    // Should show 404 page with long parameter (might be truncated)
    // Check for the beginning of the long parameter
    const pageNotFound = await page
      .getByText("Page Not Found: /AAA")
      .first()
      .isVisible();
    expect(pageNotFound).toBeTruthy();
  });

  test("should handle numeric community parameter", async ({ page }) => {
    await page.goto("/123");
    await testUtils.waitForAppToLoad();

    // Should show 404 page
    await expect(page.getByText("Page Not Found: /123").first()).toBeVisible();
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
    await testUtils.waitForAppToLoad();

    // Should handle gracefully without crashing and show 404 for the final invalid page
    await expect(
      page.getByText("Page Not Found: /INVALID3").first(),
    ).toBeVisible();
  });

  test("should handle navigation from valid to invalid community", async ({
    page,
  }) => {
    // Start with valid community
    await testUtils.navigateToCommunity("AK91");
    await expect(page.locator("h1")).toContainText("Craig, Alaska");

    // Navigate to invalid community
    await page.goto("/INVALID");
    await testUtils.waitForAppToLoad();

    // Should show 404 page with the invalid path
    await expect(
      page.getByText("Page Not Found: /INVALID").first(),
    ).toBeVisible();
  });

  test("should handle Unicode characters in community parameter", async ({
    page,
  }) => {
    await page.goto("/AK🏔️91");
    await testUtils.waitForAppToLoad();

    // Should show 404 page with Unicode path (might be URL encoded)
    // Check for either encoded or the parts we can reliably find
    const hasAK = await page.getByText("AK").first().isVisible();
    const has91 = await page.getByText("91").first().isVisible();
    const hasPageNotFound = await page
      .getByText("Page Not Found")
      .first()
      .isVisible();

    expect(hasPageNotFound && hasAK && has91).toBeTruthy();
  });

  test("should handle URL encoded community parameter", async ({ page }) => {
    // %41%4B%39%31 is URL encoded "AK91"
    await page.goto("/%41%4B%39%31");
    await testUtils.waitForAppToLoad();

    // This should actually work since it decodes to AK91
    await expect(page.locator("h1")).toContainText("Craig, Alaska");
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
    await testUtils.waitForAppToLoad();

    // Should show 404 page with nested route path
    // Check for the parts we know should be there
    const hasPageNotFound = await page
      .getByText("Page Not Found")
      .first()
      .isVisible();
    const hasAK91 = await page.getByText("AK91").first().isVisible();
    const hasInvalid = await page.getByText("invalid").first().isVisible();

    expect(hasPageNotFound && hasAK91 && hasInvalid).toBeTruthy();
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
      await testUtils.waitForAppToLoad();

      const is404 = await page.getByText("Page Not Found").first().isVisible();
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
    await testUtils.waitForAppToLoad();

    // Should show 404 page
    await expect(page.getByText("Page Not Found: /AK").first()).toBeVisible();
  });
});
