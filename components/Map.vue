<template>
  <div class="map-container">
    <div :key="mapStore.selectedCommunity" id="map"></div>
    <MapLegend />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useMapStore } from "~/stores/map";
import MapLegend from "./MapLegend.vue";

const mapStore = useMapStore();

const initializeMap = async () => {
  if (mapStore.selectedCommunity) {
    await nextTick();
    setTimeout(() => {
      mapStore.initializeMap();
    }, 50);
  }
};

watch(
  () => mapStore.selectedCommunity,
  () => {
    initializeMap();
  },
);

onMounted(() => {
  initializeMap();
});
</script>

<style scoped>
#map {
  height: 100vh;
  aspect-ratio: 1 / 1;
}
</style>
