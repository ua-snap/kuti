<template>
  <main class="mb-6">
    <h1 class="title is-3">Landslide Hazard Maps</h1>
    <div class="content is-size-5">
      <p>
        Below are maps that show where landslides are likely to occur on Prince
        of Wales Island. They include:
      </p>
      <ul>
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
      <p>
        The modeled landslides were developed using topography and estimates of
        soil characteristics, but soil is complex and varies by location, even
        in locations close together. Landslides may occur in places not
        identified as &ldquo;at risk&rdquo; by these maps.
      </p>
      <p>Download the maps below to view them and print them out.</p>
    </div>
  </main>

  <div v-for="map in staticMaps" :key="map.file" class="content is-size-5">
    <h2 class="title is-4 mt-4 mb-1">{{ map.title }}</h2>
    <img
      :src="`/static_maps/${map.file}`"
      :alt="map.title"
      class="static-map-image"
    />
    <p class="mt-2">
      <a :href="`/static_maps/${map.file}`" :download="map.file">
        Download {{ map.title }}
      </a>
    </p>
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

<style lang="scss"></style>
