<template>
  <div class="layer-list" :class="{ collapsed: isCollapsed }">
    <div class="header-row">
      <h3 v-show="!isCollapsed" class="title">Landslide Hazard</h3>
      <button
        class="toggle-button"
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
  background: white;
  padding: 1.25rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  .collapsed & {
    margin-bottom: 0;
  }
}

.toggle-button {
  background: white;
  border: 1px solid #ddd;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #333;
  line-height: 1;
  border-radius: 3px;
  min-width: 30px;
  flex-shrink: 0;

  &:hover {
    color: #000;
    background: rgba(200, 200, 200, 0.5);
    border-color: #999;
  }
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
