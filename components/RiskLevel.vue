<template>
  <h2>
    {{ currentRisk.level.charAt(0).toUpperCase() + currentRisk.level.slice(1) }}
    risk of landslide now
  </h2>
  <p>Last updated {{ lastUpdated }}</p>

  <h3>24 hour forecast</h3>
  <p>
    {{ forecast24h.level.charAt(0).toUpperCase() + forecast24h.level.slice(1) }}
    risk for the next 24 hours
  </p>

  <h3>3 day forecast</h3>
  <div v-for="day in forecast3day" :key="day.day">
    <h4>{{ day.day }}</h4>
    <span>{{ day.level.charAt(0).toUpperCase() + day.level.slice(1) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currentRisk = ref({
  level: "low",
  description: "Low risk conditions currently observed.",
});

const forecast24h = ref({
  level: "medium",
  description: "Medium risk for the next 24 hours.",
});

const forecast3day = ref([
  { day: "Today", level: "low" },
  { day: "Wednesday", level: "medium" },
  { day: "Thursday", level: "high" },
]);

const lastUpdated = ref("7 minutes ago");
</script>
