<template>
  <div class="map-layers-panel">
    <h3>Map Layers</h3>
    <div class="layers-list">
      <div v-for="layer in mapStore.layers" :key="layer.id" class="layer-item">
        <label class="layer-toggle">
          <input
            type="checkbox"
            :checked="layer.visible"
            @change="mapStore.toggleLayer(layer.id)"
          />
          <span class="layer-name">{{ layer.displayName }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";

const mapStore = useMapStore();
</script>

<style scoped lang="scss">
.map-layers-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 500px;
  z-index: 1000;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    border-bottom: 2px solid #333;
    padding-bottom: 0.5rem;
  }
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.layer-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .layer-name {
    font-size: 0.95rem;
  }

  &:hover {
    .layer-name {
      color: #0066cc;
    }
  }
}

.opacity-control {
  padding-left: 1.75rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: #666;
  }

  input[type="range"] {
    width: 100%;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
