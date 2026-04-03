<template>
  <div v-if="landslideApiStore.data" class="content">
    <div class="box content" style="max-width: 800px">
      <h2 class="title is-4">
        <span
          class="tag is-medium"
          :class="{
            'is-success': landslideApiStore.data.realtime_risk_level === 0,
            'is-warning': landslideApiStore.data.realtime_risk_level === 1,
            'is-danger': landslideApiStore.data.realtime_risk_level === 2,
          }"
        >
          {{
            landslideApiStore.getRiskLevelText(
              landslideApiStore.data.realtime_risk_level,
            )
          }}
          risk of landslide now
        </span>
      </h2>
      <p>
        <strong>Precipitation:</strong>
        {{ landslideApiStore.data.realtime_rainfall_mm }} mm
      </p>
      <p>
        <strong>Previous 24 hours:</strong>
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
          <summary class="is-flex is-clickable">
            <h4 class="title is-5 mb-0 is-flex is-align-items-center">
              {{ dayGroup.label }}
            </h4>
            <span
              class="tag is-medium ml-auto"
              :class="{
                'is-success': dayGroup.riskLevel === 0,
                'is-warning': dayGroup.riskLevel === 1,
                'is-danger': dayGroup.riskLevel === 2,
              }"
            >
              {{ landslideApiStore.getRiskLevelText(dayGroup.riskLevel) }}
            </span>
          </summary>
          <div class="pt-4">
            <table class="forecast-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Risk</th>
                  <th scope="col">Precipitation</th>
                  <th scope="col">Past 24 hours</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(block, index) in dayGroup.blocks"
                  :key="block.forecast_hour"
                  :class="{
                    'has-background-info-light': dayIndex === 0 && index === 0,
                  }"
                >
                  <td class="time-cell">
                    <p class="title is-5 mb-0">
                      {{ formatBlockTime(block.timestamp) }}
                    </p>
                  </td>
                  <td>
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
                  </td>
                  <td class="data-cell">
                    <strong>{{ block.intensity_mm }} mm</strong>
                  </td>
                  <td class="data-cell">
                    <strong>{{ block.antecedent_mm }} mm</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLandslideApiStore } from "~/stores/landslideApi";
import { formatDistanceToNow, format, isSameDay, isToday } from "date-fns";
import { computed } from "vue";
import type { ForecastBlock } from "~/types/custom";

const landslideApiStore = useLandslideApiStore();

interface DayGroup {
  label: string;
  blocks: ForecastBlock[];
  riskLevel: number;
  date: Date;
}

const groupedForecastsByDay = computed<DayGroup[]>(() => {
  if (
    !landslideApiStore.data?.forecast_blocks ||
    landslideApiStore.data.forecast_blocks.length === 0
  ) {
    return [];
  }

  const blocks = landslideApiStore.data.forecast_blocks;
  const groups: DayGroup[] = [];

  // Group forecast blocks into days
  blocks.forEach((block) => {
    const blockDate = new Date(block.timestamp);
    let existingGroup = groups.find((g) => isSameDay(g.date, blockDate));

    if (!existingGroup) {
      let label = "";
      if (isToday(blockDate)) {
        label = "Today";
      } else {
        // Label with name of the day of the week
        label = format(blockDate, "EEEE");
      }

      existingGroup = {
        label,
        blocks: [],
        riskLevel: block.risk_level,
        date: blockDate,
      };
      groups.push(existingGroup);
    }

    // Finds maximum risk level for the day to give risk level for the day
    if (block.risk_level > existingGroup.riskLevel) {
      existingGroup.riskLevel = block.risk_level;
    }

    existingGroup.blocks.push(block);
  });

  // Returns the first 3 days for today, tomorrow, and the day after
  return groups.slice(0, 3);
});

function formatBlockTime(timestamp: string): string {
  const date = new Date(timestamp);
  return format(date, "h a");
}
</script>

<style scoped>
th[scope="col"] {
  vertical-align: bottom;
}

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
  max-width: 800px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 1rem;
}

.forecast-table {
  width: 100%;
}

.forecast-table thead th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 2px solid #dbdbdb;
  background-color: #f5f5f5;
}

.forecast-table tbody tr {
  border-bottom: 1px solid #dbdbdb;
}

.forecast-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  vertical-align: middle;
}

.data-cell {
  font-size: 0.875rem;
}
</style>
