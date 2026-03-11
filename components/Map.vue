<template>
  <div class="interactive-map-page">
    <main>
      <h1 class="title is-3 mx-5 mt-4 mb-2">Landslide Hazard Map</h1>
      <div class="map-wrapper">
        <div id="map"></div>
        <LayerList />
        <button
          class="reset-map-button"
          @click="mapStore.resetView()"
          title="Reset to overview"
        >
          Reset Map
        </button>
      </div>
    </main>
  </div>
  <MapLegend />
</template>

<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { useMapStore } from "~/stores/map";
import LayerList from "~/components/LayerList.vue";
import MapLegend from "./MapLegend.vue";

const mapStore = useMapStore();

const initializeMap = async () => {
  await nextTick();
  setTimeout(() => {
    mapStore.initializeMap();
  }, 50);
};

onMounted(() => {
  initializeMap();
});
</script>

<style lang="scss">
.interactive-map-page {
  display: flex;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.map-wrapper {
  position: relative;
  flex: 1;
  min-height: 600px;

  #map {
    width: 100%;
    height: 100%;
  }
}

.reset-map-button {
  position: absolute;
  bottom: 1.5rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 900;
  white-space: nowrap;

  &:hover {
    background: #f4f4f4;
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
}

.community-marker {
  background: transparent;
  border: none;
}

.circle-marker {
  background: #0066cc;
  color: white;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #0052a3;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}
</style>
