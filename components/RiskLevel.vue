<template>
  <div class="risk-level-container">
    <!-- Current Risk Status -->
    <div class="current-risk has-text-centered mb-6">
      <div class="risk-indicator">
        <div class="risk-icon" :class="currentRisk.level">
          <span class="risk-symbol">
            <span v-if="currentRisk.level === 'low'">✓</span>
            <span v-else>⚠</span>
          </span>
        </div>
        <h2 class="title is-3 mt-3">
          {{
            currentRisk.level.charAt(0).toUpperCase() +
            currentRisk.level.slice(1)
          }}
          risk of landslide now
        </h2>
      </div>
    </div>

    <!-- 24 Hour Forecast -->
    <div class="forecast-section mb-6">
      <h3 class="title is-4 mb-4">24 hour forecast</h3>
      <div class="forecast-card">
        <div class="forecast-content">
          <div class="level-icon" :class="forecast24h.level">
            <span v-if="forecast24h.level === 'low'">✓</span>
            <span v-else>⚠</span>
          </div>
          <p class="forecast-text mt-3">
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
      <div class="three-day-grid">
        <div v-for="day in forecast3day" :key="day.day" class="day-forecast">
          <div class="day-header">
            <h4 class="subtitle is-6">{{ day.day }}</h4>
          </div>
          <div class="risk-level-indicator" :class="day.level">
            <span class="level-text">{{
              day.level.charAt(0).toUpperCase() + day.level.slice(1)
            }}</span>
            <div class="level-icon" :class="day.level">
              <span v-if="day.level === 'low'">✓</span>
              <span v-else>⚠</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="last-updated has-text-grey is-size-7">
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
.risk-level-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.current-risk {
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.risk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.risk-symbol {
  font-size: 3rem;
  font-weight: bold;
}

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

.forecast-section {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.forecast-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.risk-slider {
  margin: 1rem 0;
}

.slider-track {
  position: relative;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
  transition: width 0.3s ease;
}

.slider-thumb {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid #6c757d;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
}

.three-day-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.day-forecast {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.weather-icon {
  font-size: 1.2rem;
}

.risk-level-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.level-icon {
  font-size: 1.5rem;
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

.risk-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-fill.low {
  background: #28a745;
}

.bar-fill.medium {
  background: #ffc107;
}

.bar-fill.high {
  background: #dc3545;
}

.forecast-text {
  color: #6c757d;
  font-size: 0.9rem;
}

.last-updated {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .three-day-grid {
    grid-template-columns: 1fr;
  }

  .risk-level-container {
    padding: 1rem;
  }
}
</style>
