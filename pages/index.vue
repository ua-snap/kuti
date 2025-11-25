<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <!-- Location Selection (shown when no location is selected) -->
        <div v-if="!mapStore.selectedLocation" class="has-text-centered">
          <h1 class="title is-1 mb-6">Welcome to the Kuti First Draft</h1>
          <p class="subtitle is-3 mb-6">Select your Alaska location</p>

          <div class="buttons is-centered">
            <button
              @click="mapStore.selectLocation('Craig')"
              class="button is-info is-large mx-3"
              style="min-width: 200px; min-height: 80px"
            >
              <span class="is-size-4">Craig</span>
            </button>

            <button
              @click="mapStore.selectLocation('Kassan')"
              class="button is-success is-large mx-3"
              style="min-width: 200px; min-height: 80px"
            >
              <span class="is-size-4">Kassan</span>
            </button>
          </div>
        </div>

        <!-- Main Application (shown when location is selected) -->
        <div v-else>
          <!-- Header with location info and switch option -->
          <div class="level mb-6">
            <div class="level-left">
              <div class="level-item">
                <h1 class="title is-2">
                  {{ mapStore.selectedLocation }}, Alaska
                </h1>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button
                  @click="mapStore.switchLocation"
                  class="button is-light"
                >
                  Switch Location
                </button>
              </div>
            </div>
          </div>

          <RiskLevel />
          <!-- Map Display Component -->
          <Map />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from "../stores/map";
import Map from "../components/Map.vue";

const mapStore = useMapStore();
</script>
