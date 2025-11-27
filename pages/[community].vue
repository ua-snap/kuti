<template>
  <div>
    <div>
      <div>
        <h1>{{ community }}, Alaska</h1>
      </div>
      <div>
        <NuxtLink to="/">Switch Location</NuxtLink>
      </div>
    </div>

    <RiskLevel />
    <Map />
    <Resources />
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "../stores/map";

const route = useRoute();
const mapStore = useMapStore();

const validCommunities = ["Craig", "Kasaan"];
const community = route.params.community as string;

if (!validCommunities.includes(community)) {
  throw createError({
    statusCode: 404,
    statusMessage:
      "Community not found. Valid communities are Craig and Kasaan.",
  });
}

onMounted(() => {
  mapStore.setLocation(community);
});
</script>
