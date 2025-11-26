<template>
  <div>
    <div>
      <div></div>
      <h2>
        {{
          currentRisk.level.charAt(0).toUpperCase() + currentRisk.level.slice(1)
        }}
        risk of landslide now
      </h2>
    </div>

    <div>
      <h3>24 hour forecast</h3>
      <div>
        <div>
          <div></div>
          <p>
            {{
              forecast24h.level.charAt(0).toUpperCase() +
              forecast24h.level.slice(1)
            }}
            risk for the next 24 hours
          </p>
          <button>Show chart</button>
        </div>
      </div>
    </div>

    <div>
      <h3>3 day forecast</h3>
      <div>
        <div v-for="day in forecast3day" :key="day.day">
          <div>
            <div>
              <h4>{{ day.day }}</h4>
            </div>
            <div>
              <span>{{
                day.level.charAt(0).toUpperCase() + day.level.slice(1)
              }}</span>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>Last updated {{ lastUpdated }}</div>
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
