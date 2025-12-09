<template>
  <div v-if="dataStore.error">
    <p>{{ dataStore.error }}</p>
  </div>

  <!-- Data loaded successfully -->
  <div v-else-if="dataStore.data">
    <h2>
      {{ dataStore.getRiskLevelText(dataStore.data.risk_level) }}
      risk of landslide now
    </h2>
    <p>
      Last updated
      {{
        formatDistanceToNow(new Date(dataStore.data.timestamp), {
          addSuffix: true,
        })
      }}
    </p>

    <h3>24 hour forecast</h3>
    <p>
      {{ dataStore.getRiskLevelText(dataStore.data.risk_24hr) }}
      risk for the next 24 hours
    </p>
    <p>Precipitation: {{ dataStore.data.precipitation_inches.toFixed(2) }}"</p>

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
import { formatDistanceToNow } from "date-fns";

const dataStore = useDataStore();
</script>
