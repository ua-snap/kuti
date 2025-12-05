# Playwright Testing Suite for Kuti

This directory contains comprehensive Playwright tests for the Kuti landslide risk application.

## Test Structure

### Test Files

1. **`basic-functionality.test.ts`** - Tests core app functionality

   - Homepage loading and navigation
   - Community page navigation
   - Page titles and basic UI elements
   - Mobile responsiveness
   - Map container visibility

2. **`api-success.test.ts`** - Tests successful API responses

   - Valid landslide data display
   - Different risk levels (Low, Medium, High)
   - Precipitation data in both metric and imperial units
   - Risk level indicators and timestamps
   - Multiple communities with different data

3. **`api-errors.test.ts`** - Tests API error conditions

   - Network failures (offline scenarios)
   - Server errors (500, 404, 503)
   - Invalid JSON responses
   - Slow API responses and timeouts
   - Recovery after errors
   - CORS issues

4. **`expired-data.test.ts`** - Tests expired data scenarios

   - Data past expiration date
   - Time-based error messages ("X hours ago")
   - Different expiry periods (minutes, hours, days)
   - Malformed timestamp handling
   - Transition between valid and expired data

5. **`invalid-community.test.ts`** - Tests edge cases and invalid inputs
   - Invalid community IDs
   - Case sensitivity
   - Special characters and injection attempts
   - URL encoding/decoding
   - Browser navigation edge cases

### Utilities

- **`utils.ts`** - Shared testing utilities
  - `ApiMocker` class for mocking API responses
  - `TestUtils` class for common test operations
  - Mock data generators
  - Test constants and helpers

## API Mocking

The tests use Playwright's route interception to mock API responses. This allows testing various scenarios:

```typescript
// Mock successful response
await apiMocker.mockSuccessfulResponse("AK91", { risk_level: 2 });

// Mock network failure
await apiMocker.mockNetworkFailure("AK91");

// Mock expired data
await apiMocker.mockExpiredResponse("AK91");

// Mock server error
await apiMocker.mockServerError("AK91", 500);
```

## Running Tests

### Prerequisites

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI mode for debugging
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test basic-functionality.test.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests for specific browser
npx playwright test --project=Chrome
```

## Test Configuration

The tests are configured in `playwright.config.ts`:

- **Browsers**: Chrome, Firefox, and Mobile Chrome
- **Base URL**: http://localhost:3000
- **Web Server**: Automatically starts Nuxt dev server
- **Timeouts**: 60s for tests, 10s for assertions
- **Screenshots**: On retry
- **Video**: On failure

## Environment Variables

The test environment uses these variables:

- `SNAP_API_URL`: API endpoint (defaults to https://earthmaps.io)
- `NUXT_TELEMETRY_DISABLED`: Disables Nuxt telemetry
- `NUXT_TYPECHECK`: Disables type checking for faster startup

## Writing New Tests

### Best Practices

1. **Use the utilities**: Leverage `ApiMocker` and `TestUtils` for common operations
2. **Mock API calls**: Always mock external API calls for reliable tests
3. **Wait for app load**: Use `testUtils.waitForAppToLoad()` after navigation
4. **Test error states**: Include both success and failure scenarios
5. **Use descriptive test names**: Clearly describe what is being tested

### Example Test

```typescript
import { test, expect } from "@playwright/test";
import { ApiMocker, TestUtils, TEST_COMMUNITIES } from "./utils";

test.describe("My Feature", () => {
  let apiMocker: ApiMocker;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    apiMocker = new ApiMocker(page);
    testUtils = new TestUtils(page);
  });

  test("should handle my scenario", async ({ page }) => {
    await apiMocker.mockSuccessfulResponse(TEST_COMMUNITIES.CRAIG);

    await testUtils.navigateToCommunity(TEST_COMMUNITIES.CRAIG);
    await testUtils.waitForDataLoad();

    await expect(page.locator("h1")).toContainText("Craig, Alaska");
  });
});
```

## Test Data

Tests use mock data that simulates the real API response structure:

```typescript
interface LandslideData {
  expires_at: string; // ISO timestamp when data expires
  precipitation_24hr: number; // 24-hour precipitation
  precipitation_2days: number; // 2-day precipitation
  precipitation_3days: number; // 3-day precipitation
  precipitation_inches: number; // Total precipitation in inches
  precipitation_mm: number; // Total precipitation in mm
  risk_24hr: number; // 24-hour risk level
  risk_2days: number; // 2-day risk level
  risk_3days: number; // 3-day risk level
  risk_is_elevated_from_previous: boolean;
  risk_level: number; // 0=Low, 1=Medium, 2=High
  timestamp: string; // ISO timestamp of last update
}
```

## Debugging Tests

1. **Use headed mode**: `npx playwright test --headed` to see the browser
2. **Use debug mode**: `npm run test:debug` to step through tests
3. **Use UI mode**: `npm run test:ui` for interactive debugging
4. **Check screenshots**: Failed tests automatically capture screenshots
5. **Check console logs**: Use `page.on('console', console.log)` to see app logs

## Continuous Integration

Tests are configured to run efficiently in CI environments:

- **Headless mode**: Runs without GUI in CI
- **Reduced workers**: Single worker in CI for stability
- **Retries**: Automatic retry on failure in CI
- **Browser args**: Optimized for CI environments (no-sandbox, etc.)
