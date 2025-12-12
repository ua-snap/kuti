import { test, expect } from "@playwright/test";
import {
  ApiMocker,
  TEST_COMMUNITIES,
  createValidLandslideData,
} from "./utils";

test.describe("Map Coordinates Test Suite", () => {
  let apiMocker: ApiMocker;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    await apiMocker.setupGlobalMocks();
  });

  test("should navigate to /AK91 route and verify Leaflet map has correct lat/lng for Craig", async ({
    page,
  }) => {
    // Mock successful API response for Craig with correct coordinates
    const validData = createValidLandslideData({
      community: {
        name: "Craig",
        latitude: 55.4764,
        longitude: -133.148,
      },
    });

    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG, validData);
    
    // Navigate to the /AK91 route (Craig)
    await page.goto(`/${TEST_COMMUNITIES.CRAIG}`);
    
    // Wait for async data to finish loading
    await expect(page.locator(".async-finished")).toBeVisible();
    
    // Wait for the map to be visible
    await expect(page.locator("#map")).toBeVisible();

    // Wait a bit for Leaflet to initialize
    await page.waitForTimeout(1000);

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
    // Using toBeCloseTo for floating point comparison with 4 decimal places
    expect(mapCenter?.lat).toBeCloseTo(55.4764, 4);
    expect(mapCenter?.lng).toBeCloseTo(-133.148, 3);
  });
});
