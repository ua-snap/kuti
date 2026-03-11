<template>
  <div v-if="layer" class="layer">
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
}

.checkmark {
  display: inline;
}

.invisible {
  visibility: hidden;
}
</style>
