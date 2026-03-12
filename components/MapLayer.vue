<template>
  <div
    v-if="layer"
    class="is-flex is-align-items-center is-justify-content-space-between layer"
  >
    <span class="layer-title">
      <a @click.prevent="toggleLayer(id)">
        <span class="checkmark" :class="{ invisible: !layer.visible }"
          >&#10003;&nbsp;</span
        >
        <span
          :class="{
            visible: layer.visible,
          }"
        >
          {{ layer.displayName }}
        </span>
      </a>
    </span>
    <span v-if="legendClass" :class="['legend-symbol', legendClass]"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMapStore } from "~/stores/map";

const props = defineProps<{
  id: string;
}>();

const mapStore = useMapStore();

const layer = computed(() => {
  return mapStore.layers.find((l) => l.id === props.id);
});

const legendMap: Record<string, string> = {
  initiation: "swatch-initiation",
  runout: "swatch-runout",
  tongass: "swatch-inventory",
  roads: "line-road",
  streams: "line-stream",
};

const legendClass = computed(() => {
  return legendMap[props.id] || null;
});

const toggleLayer = (layerId: string) => {
  mapStore.toggleLayer(layerId);
};
</script>

<style scoped lang="scss">
a {
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  span {
    color: #33a;
    padding: 0;
    margin: 0;
  }
}

.layer {
  margin: 5px 0;
  cursor: pointer;
}

.visible {
  font-weight: 900;
  text-shadow:
    #f4d609 1px 1px 7px,
    #f4d609 -1px -1px 7px;
}

.layer-title {
  display: inline-block;
  padding-left: 1ex;
  flex: 1;
}

.checkmark {
  display: inline;
}

.invisible {
  visibility: hidden;
}

.legend-symbol {
  margin-left: 10px;
  flex-shrink: 0;
}

%swatch-base {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #000;
}

%line-base {
  display: inline-block;
  width: 30px;
  height: 4px;
  border-radius: 2px;
}

.swatch-initiation {
  @extend %swatch-base;
  background-color: red;
}

.swatch-runout {
  @extend %swatch-base;
  background-color: #eeb63d;
}

.swatch-inventory {
  @extend %swatch-base;
  background-color: #cccccc;
  border: 3px solid black;
}

.line-road {
  @extend %line-base;
  background-color: #333;
}

.line-stream {
  @extend %line-base;
  background-color: #3399ff;
}
</style>
