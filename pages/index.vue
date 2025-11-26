<template>
  <div>
    <div>
      <div v-if="!mapStore.selectedLocation">
        <h1>Welcome to the Kuti First Draft</h1>
        <p>Select your Alaska location</p>

        <div>
          <a @click.prevent="mapStore.setLocation('Craig')" href="#">Craig</a>
          &nbsp;
          <a @click.prevent="mapStore.setLocation('Kassan')" href="#">Kassan</a>
        </div>
      </div>

      <div v-else>
        <div>
          <div>
            <h1>{{ mapStore.selectedLocation }}, Alaska</h1>
          </div>
          <div>
            <a @click.prevent="mapStore.switchLocation" href="#"
              >Switch Location</a
            >
          </div>
        </div>

        <RiskLevel />
        <Map />
        <Resources />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from "../stores/map";
import Map from "../components/Map.vue";

const mapStore = useMapStore();
</script>
