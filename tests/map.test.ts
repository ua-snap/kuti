import { test, expect } from "@playwright/test";

test.describe("Map tests", () => {
  test("map displays at proper coordinates on map page", async ({ page }) => {
    await page.goto("/map");

    // This should be created immediately, so don't wait for the API to load.
    // But, still need to await the DOM being fully mounted.
    await expect(page.locator("#map")).toBeVisible();
    await expect(page.locator("#map")).toHaveClass(/leaflet\-container/);

    // Access the Leaflet map object and verify its center coordinates
    const mapCenter = await page.evaluate(() => {
      // Access the map through the window object (exposed by map store for testing)
      const map = (window as any).__leafletMap;
      if (!map) return null;

      const center = map.getCenter();
      return {
        lat: center.lat,
        lng: center.lng,
      };
    });

    // Verify that the map center coordinates exist
    expect(mapCenter).not.toBeNull();
    expect(mapCenter?.lat).toBeDefined();
    expect(mapCenter?.lng).toBeDefined();

    // Verify that the map center coordinates match the initial regional view
    // Using toBeCloseTo for floating point comparison with 4 decimal places
    expect(mapCenter?.lat).toBeCloseTo(55.5077, 4);
    expect(mapCenter?.lng).toBeCloseTo(-132.5, 4);
  });

  test("Craig and Kasaan buttons are visible on initial map load", async ({
    page,
  }) => {
    await page.goto("/map");

    await expect(page.locator("#map")).toBeVisible();

    // Check that both community marker buttons are visible
    const craigButton = page.locator(".circle-marker", { hasText: "Craig" });
    const kasaanButton = page.locator(".circle-marker", { hasText: "Kasaan" });

    await expect(craigButton).toBeVisible();
    await expect(kasaanButton).toBeVisible();
  });

  test("clicking Craig button zooms to Craig", async ({ page }) => {
    await page.goto("/map");

    await expect(page.locator("#map")).toBeVisible();

    // Click the Craig button
    const craigButton = page.locator(".circle-marker", { hasText: "Craig" });
    // Use dispatchEvent for better compatibility with mobile viewports
    await craigButton.evaluate((el) => {
      el.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    // Wait for the zoom animation to complete
    await page.waitForTimeout(2500);

    // Verify the map has zoomed to Craig's coordinates
    const mapCenter = await page.evaluate(() => {
      const map = (window as any).__leafletMap;
      if (!map) return null;
      const center = map.getCenter();
      return { lat: center.lat, lng: center.lng };
    });

    expect(mapCenter?.lat).toBeCloseTo(55.4764, 3);
    expect(mapCenter?.lng).toBeCloseTo(-133.148, 3);
  });

  test("layer list is visible and collapsible", async ({ page }) => {
    await page.goto("/map");

    // Wait for the page to be fully hydrated
    await page.waitForLoadState("networkidle");

    await expect(page.locator("#map")).toBeVisible();

    // Check that the layer list is visible
    const layerList = page.getByTestId("layer-list");
    await expect(layerList).toBeVisible();

    // Check that the title is visible
    const title = page.getByTestId("layer-list-title");
    await expect(title).toBeVisible();

    // Get the toggle button
    const collapseButton = page.getByTestId("layer-list-toggle");
    await expect(collapseButton).toContainText("−");

    // Use dispatchEvent to trigger the click, which works better with Vue
    await collapseButton.evaluate((el) => {
      el.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    // Wait for Vue reactivity
    await page.waitForTimeout(500);

    // Check that the button text changed
    await expect(collapseButton).toContainText("+");

    // Check that the title is no longer visible
    await expect(title).not.toBeVisible();

    // Click to expand again
    await collapseButton.evaluate((el) => {
      el.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    await page.waitForTimeout(500);

    // Check that the button text changed back
    await expect(collapseButton).toContainText("−");

    // Check that the title is visible again
    await expect(title).toBeVisible();
  });

  test("Reset Map button returns to initial view", async ({ page }) => {
    await page.goto("/map");

    await expect(page.locator("#map")).toBeVisible();

    // Click Craig to zoom in
    const craigButton = page.locator(".circle-marker", { hasText: "Craig" });
    // Use dispatchEvent for better compatibility with mobile viewports
    await craigButton.evaluate((el) => {
      el.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });
    await page.waitForTimeout(2000);

    // Click Reset Map button
    const resetButton = page.locator("button", { hasText: "Reset Map" });
    await resetButton.click();
    await page.waitForTimeout(2000);

    // Verify we're back at the initial regional view
    const mapCenter = await page.evaluate(() => {
      const map = (window as any).__leafletMap;
      if (!map) return null;
      const center = map.getCenter();
      return { lat: center.lat, lng: center.lng };
    });

    expect(mapCenter?.lat).toBeCloseTo(55.5077, 4);
    expect(mapCenter?.lng).toBeCloseTo(-132.5, 4);

    // Verify Craig and Kasaan buttons are visible again
    await expect(craigButton).toBeVisible();
    await expect(
      page.locator(".circle-marker", { hasText: "Kasaan" }),
    ).toBeVisible();
  });
});
