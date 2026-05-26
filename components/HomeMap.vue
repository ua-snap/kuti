<template>
  <div class="map-container is-hidden-mobile">
    <div id="location-map" class="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const { $L } = useNuxtApp();

  const map = $L.map("location-map", {
    center: [55.5, -132.8],
    zoom: 9,
    scrollWheelZoom: false,
    dragging: false,
    zoomControl: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: false,
  });

  $L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add marker for Craig
  $L.marker([55.4764, -133.1489]).addTo(map);

  // Add marker for Kasaan
  $L.marker([55.5369, -132.3964]).addTo(map);
});
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem 0;
}

.map {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
