<template>
  <div class="layer-list">
    <h3 class="title">Landslide Hazard</h3>
    <ul>
      <li>
        <MapLayer id="initiation" />
      </li>
      <li>
        <MapLayer id="runout" />
      </li>
      <li>
        <MapLayer id="tongass" />
      </li>
    </ul>

    <h3 class="title">Terrain &amp; Features</h3>
    <ul>
      <li>
        <MapLayer id="hillshade" />
      </li>

      <li>
        <MapLayer id="roads" />
      </li>
      <li>
        <MapLayer id="streams" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import MapLayer from "./MapLayer.vue";
</script>

<style scoped lang="scss">
.layer-list {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 380px;
  z-index: 1000;
  font-size: 1.1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

h3.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  color: #000;

  &:first-child {
    margin-top: 0;
  }
}

li {
  margin: 0;
  padding: 0;
}
</style>
