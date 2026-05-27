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
      <div class="is-hidden-mobile my-5">
        <img
          src="/static-map.png"
          alt="Map showing Craig and Kasaan on Prince of Wales Island"
          class="is-fullwidth"
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
