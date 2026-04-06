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
        <div v-if="landslideApiStore.httpError" class="http-error">
          <div
            v-if="
              landslideApiStore.httpError ==
              ApiResponse.API_HTTP_RESPONSE_STALE_DATA
            "
            class="stale-data"
          >
            <p>
              Sorry! The data sources that this tool uses have not been
              available to the app for a while, so we can&apos;t report on the
              current landslide risk.
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
              The database is temporarily offline. We&apos;re actively
              investigating and working to restore service, please try again
              shortly.
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
              We&apos;re unable to retrieve landslide risk data right now due to
              an unexpected error. We&apos;re actively working on a fix—please
              try again soon.
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
              The request timed out while retrieving landslide risk data. Please
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
