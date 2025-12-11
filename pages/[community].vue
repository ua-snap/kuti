<template>
  <div>
    <ClientOnly>
      <div v-if="landslideApiStore.loading" class="async-loading">
        <p>Loading landslide risk data...</p>
      </div>
      <div v-else class="async-finished">
        <div v-if="landslideApiStore.httpError" class="http-error">
          <div
            v-if="
              landslideApiStore.httpError ==
              ApiResponse.API_HTTP_RESPONSE_STALE_DATA
            "
            class="stale-data"
          >
            <p>
              The landslide risk data is currently stale. Please try again
              later.
            </p>
          </div>
          <div
            v-if="
              landslideApiStore.httpError ===
              ApiResponse.API_HTTP_RESPONSE_DATABASE_UNREACHABLE
            "
            class="database-inaccessible"
          >
            <p>
              The database is currently inaccessible. Please try again later.
            </p>
          </div>
          <div
            v-if="
              landslideApiStore.httpError ===
              ApiResponse.API_HTTP_RESPONSE_GENERAL_ERROR
            "
            class="general-error"
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
        <div v-else class="forecast-loaded">
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
  title: "Landslide risk for Alaskan communities",
});
</script>
