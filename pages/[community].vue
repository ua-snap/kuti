<template>
  <div class="container">
    <h1 class="title is-3 ml-2">
      Current landslide risk near {{ communityName }}
    </h1>
    <ClientOnly>
      <div v-if="showLoading" class="block content is-size-5">
        <p>Loading landslide risk data&hellip;</p>
      </div>
      <div v-else-if="!landslideApiStore.loading">
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
          <div
            v-if="
              landslideApiStore.httpError ===
              ApiResponse.API_HTTP_RESPONSE_TIMEOUT
            "
            class="timeout-error"
          >
            <p>
              The request timed out while fetching landslide risk data. Please
              check your connection and try again.
            </p>
          </div>
        </div>
        <div v-else class="forecast-loaded">
          <RiskLevel />
        </div>
      </div>
    </ClientOnly>
    <Resources />
  </div>
</template>

<script setup lang="ts">
import { useLandslideApiStore, isCommunityId } from "~/stores/landslideApi";
import { type CommunityId, CommunityNames, ApiResponse } from "~/types/custom";
import { ref, watch, computed } from "vue";

const route = useRoute();
const landslideApiStore = useLandslideApiStore();

definePageMeta({
  validate: (route) => {
    return isCommunityId(route.params.community);
  },
});

const communityId = computed(() => route.params.community as CommunityId);
const communityName = CommunityNames[communityId.value];

const showLoading = ref(false);
let loadingTimeout: NodeJS.Timeout | null = null;

watch(
  () => landslideApiStore.loading,
  (isLoading) => {
    if (isLoading) {
      loadingTimeout = setTimeout(() => {
        showLoading.value = true;
      }, 1500);
    } else {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
      showLoading.value = false;
    }
  },
  { immediate: true },
);

watch(
  communityId,
  async (newCommunityId) => {
    await landslideApiStore.fetchLandslideData(newCommunityId);
  },
  { immediate: true },
);

useHead({
  title: "Landslide risk for Alaskan communities",
});
</script>
