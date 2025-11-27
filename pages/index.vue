<template>
  <div>
    <h1>Welcome to the Kuti First Draft</h1>
    <p>Select your Alaska location</p>

    <div>
      <NuxtLink to="/Craig">Craig</NuxtLink>
      &nbsp;
      <NuxtLink to="/Kasaan">Kasaan</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from "../stores/map";

const mapStore = useMapStore();

onMounted(() => {
  mapStore.clearMap();
  mapStore.selectedLocation = null;
});
</script>
