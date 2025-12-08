<template>
  <div>
    <div v-if="dataStore.loading">
      <p>Loading landslide risk data...</p>
    </div>
    <div v-else>
      <div>
        <h1>{{ communityName }}, Alaska</h1>
      </div>
      <div>
        <NuxtLink to="/">Switch Location</NuxtLink>
      </div>

      <RiskLevel />
      <Map />
      <Resources />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";
import { useDataStore, isCommunityId } from "~/stores/data";
import { type CommunityId } from "~/types/custom";

const route = useRoute();
const mapStore = useMapStore();
const dataStore = useDataStore();

definePageMeta({
  validate: (route) => {
    return isCommunityId(route.params.community);
  },
});

const communityId = route.params.community as CommunityId;
const communityName = dataStore.getCommunityName(communityId);

onMounted(async () => {
  mapStore.setLocation(communityId);

  await dataStore.fetchLandslideData(communityId);
});

useHead({
  title: `Landslide risk for ${communityName}, Alaska`,
});
</script>
