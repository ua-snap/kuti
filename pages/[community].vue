<template>
  <div class="container">
    <h1 class="title is-3 ml-2 mt-2">
      Current landslide risk near {{ communityName }}
    </h1>
    <ClientOnly>
      <div v-if="showLoading" class="block content is-size-5">
        <p>Loading landslide risk data&hellip;</p>
      </div>
      <div v-else-if="!landslideApiStore.loading">
        <div v-if="landslideApiStore.httpError">
          <div class="message is-warning">
            <div class="message-body">
              ⚠️ <span v-html="errorMessage"></span>
            </div>
          </div>
        </div>
        <div v-else class="forecast-loaded">
          <RiskLevel />
        </div>
        <div class="column is-half">
          Current precipitation comes from the
          {{ communityId === "AK91" ? "CRGA2" : "PWKA2" }} rain gauge in
          {{ communityName }}, which sends its data to
          <a href="https://synopticdata.com/">Synoptic</a>. Future precipitation
          and the cumulative precipitation totals come from a weather model
          called the <a href="https://www.ecmwf.int/">ECMWF</a>.
        </div>
        <RiskExplaination />
      </div>
    </ClientOnly>
    <Resources />
  </div>
</template>

<script setup lang="ts">
import { useLandslideApiStore, isCommunityId } from "~/stores/landslideApi";
import { type CommunityId, CommunityNames, ApiResponse } from "~/types/custom";
import { ref, watch, computed, onBeforeUnmount } from "vue";
import RiskExplaination from "~/components/RiskExplaination.vue";

const route = useRoute();
const landslideApiStore = useLandslideApiStore();

definePageMeta({
  validate: (route) => {
    return isCommunityId(route.params.community);
  },
});

const errorMessage = computed(() => {
  switch (landslideApiStore.httpError) {
    case ApiResponse.API_HTTP_RESPONSE_STALE_DATA:
      return `Sorry! The data sources that this tool uses have not been
              available to the app for a while, so we can&apos;t report on the
              current landslide risk.`;
    case ApiResponse.API_HTTP_RESPONSE_TIMEOUT:
      return "Sorry, we cannot reach our data sources from your device.  Please check your internet connection and try again.";

    case ApiResponse.API_HTTP_RESPONSE_GENERAL_ERROR: // fallthru
    case ApiResponse.API_HTTP_RESPONSE_DATABASE_UNREACHABLE:
    default:
      return "Sorry, we cannot access the data sources that provide current landslide risk right now.  Please try again later.";
  }
});

const communityId = computed(() => route.params.community as CommunityId);
const communityName = CommunityNames[communityId.value];

const showLoading = ref(false);
let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

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

onBeforeUnmount(() => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
});

useHead({
  title: "Landslide risk for Alaskan communities",
});
</script>
