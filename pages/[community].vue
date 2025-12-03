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
import { useDataStore } from "~/stores/data";
import {
  VALID_COMMUNITIES,
  getCommunityName,
  type Community,
} from "~/utils/luts";

const route = useRoute();
const mapStore = useMapStore();
const dataStore = useDataStore();

definePageMeta({
  validate: (route) => {
    return VALID_COMMUNITIES.includes(route.params.community as Community);
  },
});

const communityId = route.params.community as Community;
const communityName = getCommunityName(communityId);

onMounted(async () => {
  mapStore.setLocation(communityName);

  await dataStore.fetchLandslideData(communityId);
});

useHead({
  title: `${communityName}, Alaska`,
});
</script>
