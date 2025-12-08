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

const communityId = computed(() => route.params.community as CommunityId);
const communityName = computed(() =>
  dataStore.getCommunityName(communityId.value),
);

watch(
  communityId,
  async (newCommunityId) => {
    mapStore.setLocation(newCommunityId);
    await dataStore.fetchLandslideData(newCommunityId);
  },
  { immediate: true },
);

useHead({
  title: computed(() => `Landslide risk for ${communityName.value}, Alaska`),
});
</script>
