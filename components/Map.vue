<template>
  <div
    :key="mapStore.selectedLocation"
    id="map"
    style="height: 500px; width: 100%"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useMapStore } from "~/stores/map";

const mapStore = useMapStore();

const initializeMap = async () => {
  if (mapStore.selectedLocation) {
    await nextTick();
    setTimeout(() => {
      mapStore.initializeMap();
    }, 50);
  }
};

watch(
  () => mapStore.selectedLocation,
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
  min-height: 400px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
