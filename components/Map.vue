<template>
  <div :key="mapStore.selectedCommunity" id="map"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useMapStore } from "~/stores/map";

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
  min-height: 50vh;
  width: 100%;
}
</style>
