<template>
  <div class="is-flex">
    <main class="is-flex is-flex-direction-column is-flex-grow-1">
      <div class="mx-5 mt-4 mb-2">
        <h1 class="title is-3 mb-2">Landslide Hazard Map</h1>
        <p class="block is-size-5">
          <a
            href="https://s3.us-west-2.amazonaws.com/downloads.powlandslides.org/landslide-layers.zip"
            >Download a ZIP file of all layers</a
          >
          (147MB) in GIS formats (GeoTIFF and shapefiles).
        </p>
      </div>
      <div class="map-wrapper">
        <div id="map"></div>
        <LayerList />
        <button
          class="button is-light reset-map-button"
          @click="mapStore.resetView()"
          title="Reset to overview"
        >
          Reset Map
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { useMapStore } from "~/stores/map";
import LayerList from "~/components/LayerList.vue";

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
  top: 1rem;
  left: 1rem;
  z-index: 900;
  font-weight: 600;
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
