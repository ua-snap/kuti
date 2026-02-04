<template>
  <div v-if="landslideApiStore.data">
    <h2>
      {{
        landslideApiStore.getRiskLevelText(
          landslideApiStore.data.realtime_risk_level,
        )
      }}
      risk of landslide now
    </h2>
    <p>
      Precipitation:
      {{ landslideApiStore.data.realtime_rainfall_mm }} mm
    </p>
    <p>
      Previous 24 hours:
      {{ landslideApiStore.data.realtime_antecedent_mm }} mm
    </p>
    <p>
      Last updated
      {{
        formatDistanceToNow(new Date(landslideApiStore.data.timestamp), {
          addSuffix: true,
        })
      }}
    </p>

    <h3>24 hour forecast</h3>
    <p>
      {{
        landslideApiStore.getRiskLevelText(
          landslideApiStore.data["block_24hr"].risk_level,
        )
      }}
      risk for the next 24 hours
    </p>

    <h3>3 day forecast</h3>
    <div>
      <h4>24 hours</h4>
      <p>
        Risk Level:
        {{
          landslideApiStore.getRiskLevelText(
            landslideApiStore.data["block_24hr"].risk_level,
          )
        }}
      </p>
      <p>
        Precipitation:
        {{ landslideApiStore.data["block_24hr"].intensity_mm }} mm
      </p>
      <p>
        Previous 24 hours:
        {{ landslideApiStore.data["block_24hr"].antecedent_mm }} mm
      </p>
    </div>
    <div>
      <h4>2 days</h4>
      <p>
        {{
          landslideApiStore.getRiskLevelText(
            landslideApiStore.data["block_2days"].risk_level,
          )
        }}
      </p>
      <p>
        Precipitation:
        {{ landslideApiStore.data["block_2days"].intensity_mm }} mm
      </p>
      <p>
        Previous 24 hours:
        {{ landslideApiStore.data["block_2days"].antecedent_mm }} mm
      </p>
    </div>
    <div>
      <h4>3 days</h4>
      <p>
        {{
          landslideApiStore.getRiskLevelText(
            landslideApiStore.data["block_3days"].risk_level,
          )
        }}
      </p>
      <p>
        Precipitation:
        {{ landslideApiStore.data["block_3days"].intensity_mm }} mm
      </p>
      <p>
        Previous 24 hours:
        {{ landslideApiStore.data["block_3days"].antecedent_mm }} mm
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLandslideApiStore } from "~/stores/landslideApi";
import { formatDistanceToNow } from "date-fns";

const landslideApiStore = useLandslideApiStore();
</script>
