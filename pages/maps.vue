<template>
  <div class="container">
    <Maps />
    <div class="is-hidden-mobile">
      <Map />
    </div>
    <p>
      Modeled Landslide Prone Areas do not integrate current or forecasted
      rainfall.
    </p>
  </div>
</template>

<script setup lang="ts">
import Maps from "~/components/Maps.vue";
</script>
