<template>
  <div class="container">
    <div class="wrapper">
      <h1 class="title is-3">
        Landslide Risk for Prince of Wales Island Communities
      </h1>
      <h2 class="title is-4">
        This tool shows if there is an elevated risk of landslide by calculating
        risk level based on recent rainfall.
      </h2>

      <div class="content is-size-5 mt-4">
        <NuxtLink class="button is-large" to="/AK91"> Craig</NuxtLink>
        <NuxtLink class="button is-large ml-4" to="/AK182"> Kasaan</NuxtLink>
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
// Use flexbox to center the content horizonally
.wrapper {
  height: 50vh;
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
