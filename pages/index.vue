<template>
  <div class="container">
    <div class="wrapper">
      <h1 class="title is-3">
        Landslide Risk for Prince of Wales Island Communities
      </h1>
      <h2 class="title is-4">
        This tool shows landslide risk based on recent and forecasted rainfall.
      </h2>
      <div class="content is-size-5 mt-4">
        <NuxtLink class="button is-large" to="/AK91">West (Craig)</NuxtLink>
        <NuxtLink class="button is-large ml-4" to="/AK182"
          >East (Kasaan)</NuxtLink
        >
      </div>
      <div class="map-container is-hidden-mobile">
        <img
          src="/static-map.png"
          alt="Map showing Craig and Kasaan on Prince of Wales Island"
          class="static-map"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: `Landslide Risk for Prince of Wales Island Communities`,
});
</script>

<style lang="scss" scoped>
// Use flexbox to center the content horizontally
.map-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem 0;
}

.static-map {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
}

.wrapper {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .wrapper {
    margin: 10px;
    text-align: center;
  }
}
</style>
