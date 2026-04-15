<template>
  <div>
    <h2 class="title is-3 ml-2 mt-4">Resources</h2>

    <div class="columns is-multiline mb-2">
      <div class="column is-half-tablet is-one-third-desktop">
        <NuxtLink
          to="/landslide-101"
          class="box has-background-light resource-card"
        >
          <h3 class="title is-5">Landslide 101</h3>
          <p>Find out more about the science behind landslides</p>
        </NuxtLink>
      </div>

      <div class="column is-half-tablet is-one-third-desktop">
        <NuxtLink
          to="/areas-at-risk"
          class="box has-background-light resource-card"
        >
          <h3 class="title is-5">Areas at risk</h3>
          <p>
            Identify where you live relative to landslide susceptibility in your
            area
          </p>
        </NuxtLink>
      </div>

      <div class="column is-half-tablet is-one-third-desktop">
        <NuxtLink to="/prepare" class="box has-background-light resource-card">
          <h3 class="title is-5">How to prepare for a landslide</h3>
          <p>Learn what to do before a landslide occurs</p>
        </NuxtLink>
      </div>

      <div class="column is-half-tablet is-one-third-desktop">
        <NuxtLink
          to="/published"
          class="box has-background-light resource-card"
        >
          <h3 class="title is-5">Published work</h3>
          <p>
            Access articles published by our research team and related to this
            work
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  height: 100%;
}

.resource-card:hover {
  background-color: hsl(204, 100%, 96%) !important;
  border-color: hsl(204, 86%, 53%);
  box-shadow:
    0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
  transform: translateY(-2px);
}
</style>
