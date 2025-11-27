<template>
  <div v-if="!mapStore.selectedLocation">
    <h1>Landslide Risk for Alaskan Communities</h1>
    <h3>Where are you?</h3>
    <a @click.prevent="mapStore.setLocation('Craig')" href="#">Craig</a>
    &nbsp;
    <a @click.prevent="mapStore.setLocation('Kasaan')" href="#">Kasaan</a>
  </div>

  <div v-else>
    <h1>Landslide risk at {{ mapStore.selectedLocation }}</h1>
    <a @click.prevent="mapStore.switchLocation" href="#">Switch Location</a>
    <RiskLevel />
    <Map />
    <Resources />
  </div>
</template>

<script setup>
import { useMapStore } from "../stores/map";
import Map from "../components/Map.vue";

const mapStore = useMapStore();
</script>
