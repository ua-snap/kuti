<template>
  <div class="is-flex">
    <main class="is-flex is-flex-direction-column is-flex-grow-1">
      <div class="mx-5 mt-4 mb-4">
        <h1 class="title is-3 mb-4">Landslide Hazard Maps</h1>
        <p class="block is-size-5">
          Below are maps that show where landslides are likely to occur on
          Prince of Wales Island. They include:
        </p>
        <ul class="block is-size-5 map-legend-list">
          <li>
            The locations of previous landslides, mapped by the U.S. Forest
            Service (black, striped polygons)
          </li>
          <li>
            Model outputs showing where landslides are likely to occur in the
            future (red is where landslides start, yellow is where the landslide
            debris goes)
          </li>
          <li>Roadways and trails that may be at risk of landslides</li>
        </ul>
        <p class="block is-size-5">
          The modeled landslides were developed using topography and estimates
          of soil characteristics, but soil is complex and varies by location,
          even in locations close together. Landslides may occur in places not
          identified as "at risk" by these maps.
        </p>
        <p class="block is-size-5">
          Download the maps below to view them and print them out.
        </p>
      </div>

      <div class="mx-5 mb-6">
        <div
          v-for="map in staticMaps"
          :key="map.file"
          class="static-map-block mb-6"
        >
          <h2 class="title is-5 mb-2">{{ map.title }}</h2>
          <img
            :src="`/static_maps/${map.file}`"
            :alt="map.title"
            class="static-map-image"
          />
          <div class="mt-2">
            <a
              :href="`/static_maps/${map.file}`"
              :download="map.file"
              class="button is-light is-small"
            >
              Download {{ map.title }}
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const staticMaps = [
  { file: "craig_region_85_11.png", title: "Craig Region" },
  { file: "kasaan_thorne_bay_85_11.png", title: "Kasaan / Thorne Bay" },
  { file: "klawock_hollis_hwy_85_11.png", title: "Klawock / Hollis Highway" },
  { file: "klawock_region_85_11.png", title: "Klawock Region" },
];
</script>

<style lang="scss">
.map-legend-list {
  list-style: disc;
  padding-left: 2rem;

  li {
    margin-bottom: 0.5rem;
  }
}

.static-map-block {
  border-top: 1px solid #dbdbdb;
  padding-top: 1.5rem;
}

.static-map-image {
  width: 100%;
  max-width: 1100px;
  height: auto;
  display: block;
  border: 1px solid #dbdbdb;
}
</style>
