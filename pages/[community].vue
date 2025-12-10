<template>
  <div>
    <ClientOnly>
      <div v-if="landslideApiStore.loading">
        <p>Loading landslide risk data...</p>
      </div>

      <div v-else-if="landslideApiStore.httpError">
        <div
          v-if="
            landslideApiStore.httpError ==
            ApiResponse.API_HTTP_RESPONSE_STALE_DATA
          "
        >
          <p>
            The landslide risk data is currently stale. Please try again later.
          </p>
        </div>
        <div
          v-if="
            landslideApiStore.httpError ===
            ApiResponse.API_HTTP_RESPONSE_DATABASE_UNREACHABLE
          "
        >
          <p>The database is currently inaccessible. Please try again later.</p>
        </div>
        <div
          v-if="
            landslideApiStore.httpError ===
            ApiResponse.API_HTTP_RESPONSE_GENERAL_ERROR
          "
        >
          <p>
            An unexpected error occurred while fetching landslide risk data.
            Please try again later.
          </p>
        </div>
        <div>
          <NuxtLink to="/">Switch Location</NuxtLink>
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
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";
import { useLandslideApiStore, isCommunityId } from "~/stores/landslideApi";
import { type CommunityId, ApiResponse } from "~/types/custom";

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
