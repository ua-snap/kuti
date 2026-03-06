<template>
  <div v-if="landslideApiStore.data" class="content">
    <div class="box">
      <h2 class="title is-4">
        {{
          landslideApiStore.getRiskLevelText(
            landslideApiStore.data.realtime_risk_level,
          )
        }}
        risk of landslide now
      </h2>
      <p>
        <strong>Precipitation:</strong>
        {{ landslideApiStore.data.realtime_rainfall_mm }} mm
      </p>
      <p>
        <strong>Previous 24 hours:</strong>
        {{ landslideApiStore.data.realtime_antecedent_mm }} mm
      </p>
      <p class="is-size-7 has-text-grey">
        Last updated
        {{
          formatDistanceToNow(new Date(landslideApiStore.data.timestamp), {
            addSuffix: true,
          })
        }}
      </p>
    </div>

    <div
      v-if="
        landslideApiStore.data.forecast_blocks &&
        landslideApiStore.data.forecast_blocks.length > 0
      "
      class="block"
    >
      <h3 class="title is-4">3 Day Forecast</h3>
      <div
        v-for="(dayGroup, dayIndex) in groupedForecastsByDay"
        :key="dayGroup.label"
        class="forecast-day mb-4"
        style=""
      >
        <details :open="dayIndex === 0">
          <summary
            class="is-flex is-clickable"
          >
            <h4 class="title is-5 mb-0 is-flex is-align-items-center">{{ dayGroup.label }}</h4>
            <span
              class="tag is-medium ml-auto"
              :class="{
              'is-success': dayGroup.maxRiskLevel === 0,
              'is-warning': dayGroup.maxRiskLevel === 1,
              'is-danger': dayGroup.maxRiskLevel === 2,
              }"
            >
              {{ landslideApiStore.getRiskLevelText(dayGroup.maxRiskLevel) }}
            </span>
          </summary>
          <div class="pt-4">
            <div
              v-for="(block, index) in dayGroup.blocks"
              :key="block.forecast_hour"
              class="is-flex is-justify-content-space-between is-align-items-center py-3 px-4"
              :class="{
                'has-background-info-light': dayIndex === 0 && index === 0,
              }"
              style="border-bottom: 1px solid #dbdbdb"
            >
              <div class="is-flex is-align-items-center" style="gap: 1rem">
                <p class="title is-5 mb-0" style="min-width: 80px">
                  {{ formatBlockTime(block.timestamp, dayIndex, index) }}
                </p>
                <span
                  class="tag"
                  :class="{
                    'is-success': block.risk_level === 0,
                    'is-warning': block.risk_level === 1,
                    'is-danger': block.risk_level === 2,
                  }"
                >
                  {{ landslideApiStore.getRiskLevelText(block.risk_level) }}
                </span>
              </div>
              <div
                class="is-flex is-align-items-center is-size-7"
                style="gap: 2rem"
              >
                <div style="min-width: 120px">
                  <span class="has-text-grey">Intensity:</span>
                  <strong class="ml-2">{{ block.intensity_mm }} mm</strong>
                </div>
                <div style="min-width: 140px">
                  <span class="has-text-grey">Antecedent:</span>
                  <strong class="ml-2">{{ block.antecedent_mm }} mm</strong>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLandslideApiStore } from "~/stores/landslideApi";
import {
  formatDistanceToNow,
  format,
  isSameDay,
  isToday,
  isTomorrow,
  addDays,
} from "date-fns";
import { computed } from "vue";
import type { ForecastBlock } from "~/types/custom";

const landslideApiStore = useLandslideApiStore();

interface DayGroup {
  label: string;
  blocks: ForecastBlock[];
  maxRiskLevel: number;
  date: Date;
}

/**
 * Group forecast blocks by day and label them appropriately
 */
const groupedForecastsByDay = computed<DayGroup[]>(() => {
  if (
    !landslideApiStore.data?.forecast_blocks ||
    landslideApiStore.data.forecast_blocks.length === 0
  ) {
    return [];
  }

  const blocks = landslideApiStore.data.forecast_blocks;
  const groups: DayGroup[] = [];
  const now = new Date();
  const tomorrow = addDays(now, 1);
  const dayAfterTomorrow = addDays(now, 2);

  // Group blocks by day
  blocks.forEach((block) => {
    const blockDate = new Date(block.timestamp);
    let existingGroup = groups.find((g) => isSameDay(g.date, blockDate));

    if (!existingGroup) {
      let label = "";
      if (isToday(blockDate)) {
        label = "Today";
      } else if (isTomorrow(blockDate)) {
        label = format(blockDate, "EEEE"); // Day name like "Thursday"
      } else {
        label = format(blockDate, "EEEE"); // Day name for other days
      }

      existingGroup = {
        label,
        blocks: [],
        maxRiskLevel: 0,
        date: blockDate,
      };
      groups.push(existingGroup);
    }

    existingGroup.blocks.push(block);
    existingGroup.maxRiskLevel = Math.max(
      existingGroup.maxRiskLevel,
      block.risk_level,
    );
  });

  // Only return the first 3 days
  return groups.slice(0, 3);
});

/**
 * Format the forecast block time display
 * @param timestamp - ISO timestamp string
 * @param dayIndex - Index of the day (0 = Today)
 * @param blockIndex - Index of the block within the day
 * @returns Formatted time string
 */
function formatBlockTime(
  timestamp: string,
  dayIndex: number,
  blockIndex: number,
): string {
  const date = new Date(timestamp);
  return format(date, "h a");
}
</script>

<style scoped>
/* Minimal custom styles - using Bulma classes for most styling */
details summary {
  list-style: none;
  cursor: pointer;
  user-select: none;
}

details summary::-webkit-details-marker,
details summary::marker {
  display: none;
}

details summary::before {
  content: "▶";
  margin-right: 0.75rem;
  margin-top: 5px;
  transition: transform 0.2s;
  display: inline-block;
}

details[open] summary::before {
  transform: rotate(90deg);
  vertical-align: middle;
  margin-top: 0;
}

.forecast-day {
  min-width: 540px; 
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 1rem;
}
</style>
