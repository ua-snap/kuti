import { test, expect } from "@playwright/test";
import { TEST_COMMUNITIES } from "./utils";

test.describe("Map tests", () => {
  test("map displays at proper coordinates without waiting for API return", async ({
    page,
  }) => {
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);

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

    // Verify that the map center coordinates match Craig's coordinates
    // Using toBeCloseTo for floating point comparison with 4 decimal places for both
    expect(mapCenter?.lat).toBeCloseTo(55.4764, 4);
    expect(mapCenter?.lng).toBeCloseTo(-133.148, 4);
  });
});
