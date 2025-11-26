<template>
  <!-- Loading state -->
  <div v-if="dataStore.loading">
    <p>Loading landslide risk data...</p>
  </div>

  <!-- Error state -->
  <div v-else-if="dataStore.error">
    <p>{{ dataStore.error }}</p>
  </div>

  <!-- Data loaded successfully -->
  <div v-else-if="dataStore.data">
    <h2>
      {{ dataStore.getRiskLevelText(dataStore.data.risk_level) }}
      risk of landslide now
    </h2>
    <p v-if="dataStore.data.risk_is_elevated_from_previous">
      ⚠️ Risk has increased from previous reading
    </p>
    <p>
      Last updated {{ dataStore.formatTimestamp(dataStore.data.timestamp) }}
    </p>

    <h3>24 hour forecast</h3>
    <p>
      {{ dataStore.getRiskLevelText(dataStore.data.risk_24hr) }}
      risk for the next 24 hours
    </p>
    <p>
      Precipitation: {{ dataStore.data.precipitation_24hr }}mm ({{
        dataStore.data.precipitation_inches.toFixed(2)
      }}")
    </p>

    <h3>3 day forecast</h3>
    <div>
      <h4>24 hours</h4>
      <span>{{ dataStore.getRiskLevelText(dataStore.data.risk_24hr) }}</span>
    </div>
    <div>
      <h4>2 days</h4>
      <span>{{ dataStore.getRiskLevelText(dataStore.data.risk_2days) }}</span>
    </div>
    <div>
      <h4>3 days</h4>
      <span>{{ dataStore.getRiskLevelText(dataStore.data.risk_3days) }}</span>
    </div>

    <p>2-day precipitation: {{ dataStore.data.precipitation_2days }}mm</p>
    <p>3-day precipitation: {{ dataStore.data.precipitation_3days }}mm</p>
    <p>Data for {{ dataStore.data.place_name }}</p>
    <p>
      Risk probability:
      {{ (dataStore.data.risk_probability * 100).toFixed(6) }}%
    </p>
  </div>

  <!-- No data state -->
  <div v-else>
    <p>
      No landslide risk data available. Please select a community to view data.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";
import { useMapStore } from "~/stores/map";
import { watch } from "vue";

const dataStore = useDataStore();
const mapStore = useMapStore();

// Watch for changes in selected location and fetch data accordingly
watch(
  () => mapStore.selectedLocation,
  async (newLocation) => {
    if (newLocation) {
      await dataStore.fetchLandslideData(newLocation);
    } else {
      dataStore.clearData();
    }
  },
  { immediate: true },
);
</script>
