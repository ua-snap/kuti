# Component Updates for Better Testing

To make the tests more reliable and easier to maintain, consider adding test IDs to your Vue components:

## RiskLevel.vue

Add test IDs to make the risk level easier to test:

```vue
<template>
  <div data-testid="risk-level" class="risk-level">
    <div v-if="dataStore.error" data-testid="error-message" class="error">
      {{ dataStore.error }}
    </div>
    <div v-else-if="dataStore.loading" data-testid="loading" class="loading">
      Loading landslide risk data...
    </div>
    <div v-else-if="dataStore.data" data-testid="risk-data">
      <h2 data-testid="risk-level-heading">
        Risk Level:
        <span data-testid="risk-level-value" :class="riskLevelClass">
          {{ dataStore.getRiskLevelText(dataStore.data.risk_level) }}
        </span>
      </h2>

      <div data-testid="precipitation-data">
        <p data-testid="precipitation-inches">
          Total Precipitation: {{ dataStore.data.precipitation_inches }}" ({{
            dataStore.data.precipitation_mm
          }}mm)
        </p>

        <div data-testid="precipitation-breakdown">
          <p data-testid="precip-24hr">
            24 hours: {{ dataStore.data.precipitation_24hr }}mm
          </p>
          <p data-testid="precip-2days">
            2 days: {{ dataStore.data.precipitation_2days }}mm
          </p>
          <p data-testid="precip-3days">
            3 days: {{ dataStore.data.precipitation_3days }}mm
          </p>
        </div>
      </div>

      <p
        v-if="dataStore.data.risk_is_elevated_from_previous"
        data-testid="elevated-risk-indicator"
        class="elevated-risk"
      >
        ↑ Risk has increased from previous reading
      </p>

      <p data-testid="timestamp">
        Last updated: {{ dataStore.formatTimestamp(dataStore.data.timestamp) }}
      </p>
    </div>
  </div>
</template>
```

## Resources.vue

```vue
<template>
  <div data-testid="resources" class="resources">
    <h3>Resources</h3>
    <!-- Your existing content -->
  </div>
</template>
```

## Map.vue

```vue
<template>
  <div data-testid="map-container" class="map-container">
    <div id="map" data-testid="map"></div>
  </div>
</template>
```

## pages/[community].vue

```vue
<template>
  <div data-testid="community-page">
    <div v-if="dataStore.loading" data-testid="page-loading">
      <p>Loading landslide risk data...</p>
    </div>
    <div v-else data-testid="community-content">
      <div>
        <h1 data-testid="community-title">{{ communityName }}, Alaska</h1>
      </div>
      <div>
        <NuxtLink to="/" data-testid="switch-location-link"
          >Switch Location</NuxtLink
        >
      </div>

      <RiskLevel />
      <Map />
      <Resources />
    </div>
  </div>
</template>
```

## Benefits of These Test IDs

1. **Reliability**: Test IDs don't change with styling or text content
2. **Performance**: `data-testid` selectors are faster than text searches
3. **Maintainability**: Tests are easier to update when UI changes
4. **Clarity**: Clear intention that elements are meant for testing

## Updated Test Examples

With these test IDs, your tests become more robust:

```typescript
// Instead of searching for text
await expect(page.locator("text=/Medium/")).toBeVisible();

// Use specific test IDs
await expect(page.locator('[data-testid="risk-level-value"]')).toContainText(
  "Medium",
);

// Check for error states
expect(
  await page.locator('[data-testid="error-message"]').isVisible(),
).toBeTruthy();

// Check loading states
expect(await page.locator('[data-testid="loading"]').isVisible()).toBeFalsy();
```
