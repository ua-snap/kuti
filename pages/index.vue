<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <!-- Location Selection (shown when no location is selected) -->
        <div v-if="!selectedLocation" class="has-text-centered">
          <h1 class="title is-1 mb-6">Welcome to Kuti</h1>
          <p class="subtitle is-3 mb-6">Select your Alaska location</p>

          <div class="buttons is-centered">
            <button
              @click="selectLocation('Craig')"
              class="button is-info is-large mx-3"
              style="min-width: 200px; min-height: 80px"
            >
              <span class="icon is-large">
                <i class="fas fa-map-marker-alt"></i>
              </span>
              <span class="is-size-4">Craig</span>
            </button>

            <button
              @click="selectLocation('Kassan')"
              class="button is-success is-large mx-3"
              style="min-width: 200px; min-height: 80px"
            >
              <span class="icon is-large">
                <i class="fas fa-map-marker-alt"></i>
              </span>
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
                  <span class="icon is-large mr-2">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                  {{ selectedLocation }}, Alaska
                </h1>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button @click="switchLocation" class="button is-light">
                  Switch Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kuti - Alaska Locations",
});

const selectedLocation = ref(null);

const selectLocation = (location) => {
  selectedLocation.value = location;
};

const switchLocation = () => {
  selectedLocation.value = null;
};
</script>
