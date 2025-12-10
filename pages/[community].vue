<template>
  <div>
    <div v-if="landslideApiStore.loading">
      <p>Loading landslide risk data...</p>
    </div>

    <div v-else-if="is500Error">
      <div>
        <p>{{ landslideApiStore.error }}</p>
      </div>
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
import { useLandslideApiStore, isCommunityId } from "~/stores/landslideApi";
import { type CommunityId } from "~/types/custom";

const route = useRoute();
const mapStore = useMapStore();
const landslideApiStore = useLandslideApiStore();

definePageMeta({
  validate: (route) => {
    return isCommunityId(route.params.community);
  },
});

const communityId = computed(() => route.params.community as CommunityId);
const communityName = computed(() =>
  landslideApiStore.getCommunityName(communityId.value),
);

const is500Error = computed(() => {
  return landslideApiStore.errorType === "critical";
});

watch(
  communityId,
  async (newCommunityId) => {
    mapStore.setLocation(newCommunityId);
    await landslideApiStore.fetchLandslideData(newCommunityId);
  },
  { immediate: true },
);

useHead({
  title: computed(() => `Landslide risk for ${communityName.value}, Alaska`),
});
</script>
