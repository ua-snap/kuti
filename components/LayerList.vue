<template>
  <div class="box layer-list" :class="{ collapsed: isCollapsed }">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center header-row"
    >
      <h3 v-show="!isCollapsed" class="title">Landslide Hazard</h3>
      <button
        class="button is-small toggle-button"
        @click="isCollapsed = !isCollapsed"
        :title="isCollapsed ? 'Show Layers' : 'Hide Layers'"
      >
        <span v-if="isCollapsed">+</span>
        <span v-else>−</span>
      </button>
    </div>

    <div v-show="!isCollapsed" class="layer-content">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MapLayer from "./MapLayer.vue";

const isCollapsed = ref(false);
</script>

<style scoped lang="scss">
.layer-list {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 380px;
  z-index: 1000;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &.collapsed {
    width: auto;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
}

.header-row {
  margin-bottom: 0.5rem;

  .collapsed & {
    margin-bottom: 0;
  }
}

.toggle-button {
  font-size: 1.2rem;
  line-height: 1;
  min-width: 30px;
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
  display: block;

  .header-row & {
    margin: 0;
    display: block;
  }
}

li {
  margin: 0;
  padding: 0;
}
</style>
