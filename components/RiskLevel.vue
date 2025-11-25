<template>
  <div class="container is-max-desktop p-6">
    <!-- Current Risk Status -->
    <div class="box has-text-centered mb-6 current-risk">
      <div class="risk-icon" :class="currentRisk.level">
        <span class="is-size-1 has-text-weight-bold">
          <span v-if="currentRisk.level === 'low'">✓</span>
          <span v-else>⚠</span>
        </span>
      </div>
      <h2 class="title is-3 mt-3">
        {{
          currentRisk.level.charAt(0).toUpperCase() + currentRisk.level.slice(1)
        }}
        risk of landslide now
      </h2>
    </div>

    <!-- 24 Hour Forecast -->
    <div class="forecast-section mb-6">
      <h3 class="title is-4 mb-4">24 hour forecast</h3>
      <div class="box has-background-light">
        <div class="has-text-centered">
          <div class="level-icon is-size-2" :class="forecast24h.level">
            <span v-if="forecast24h.level === 'low'">✓</span>
            <span v-else>⚠</span>
          </div>
          <p class="has-text-grey mt-3 is-size-6">
            {{
              forecast24h.level.charAt(0).toUpperCase() +
              forecast24h.level.slice(1)
            }}
            risk for the next 24 hours
          </p>
          <button class="button is-small is-text">Show chart</button>
        </div>
      </div>
    </div>

    <!-- 3 Day Forecast -->
    <div class="forecast-section mb-6">
      <h3 class="title is-4 mb-4">3 day forecast</h3>
      <div class="columns is-mobile">
        <div v-for="day in forecast3day" :key="day.day" class="column">
          <div class="box has-background-light has-text-centered p-4">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center mb-3"
            >
              <h4 class="subtitle is-6 mb-0">{{ day.day }}</h4>
            </div>
            <div
              class="is-flex is-align-items-center is-justify-content-center mb-3"
            >
              <span class="mr-2">{{
                day.level.charAt(0).toUpperCase() + day.level.slice(1)
              }}</span>
              <div class="level-icon is-size-5" :class="day.level">
                <span v-if="day.level === 'low'">✓</span>
                <span v-else>⚠</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="has-text-grey has-text-centered is-size-7 mt-6">
      Last updated {{ lastUpdated }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Current risk status
const currentRisk = ref({
  level: "low",
  description: "Low risk conditions currently observed.",
});

// 24 hour forecast
const forecast24h = ref({
  level: "medium",
  description: "Medium risk for the next 24 hours.",
});

// 3 day forecast
const forecast3day = ref([
  { day: "Today", level: "low" },
  { day: "Wednesday", level: "medium" },
  { day: "Thursday", level: "high" },
]);

const lastUpdated = ref("7 minutes ago");
</script>

<style scoped>
/* Custom gradient background for current risk */
.current-risk {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

/* Custom circular risk icon */
.risk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

/* Risk level colors */
.risk-icon.low {
  background: #d4edda;
  color: #28a745;
}

.risk-icon.medium {
  background: #fff3cd;
  color: #ffc107;
}

.risk-icon.high {
  background: #f8d7da;
  color: #dc3545;
}

.level-icon.low {
  color: #28a745;
}

.level-icon.medium {
  color: #ffc107;
}

.level-icon.high {
  color: #dc3545;
}
</style>
