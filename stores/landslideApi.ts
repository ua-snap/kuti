import { defineStore } from "pinia";
import { ref } from "vue";
import { type CommunityId, type LandslideData } from "~/types/custom";
import { formatDistanceToNow } from "date-fns";

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && (value === "AK91" || value === "AK182");
}

export const useLandslideApiStore = defineStore("landslideApi", () => {
  const communityLandslideData = ref<LandslideData | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const errorType = ref<"critical" | "data" | null>(null);

  const { $config } = useNuxtApp();
  const apiUrl = $config.public.snapApiUrl;

  const fetchLandslideData = async (community: CommunityId): Promise<void> => {
    loading.value = true;
    error.value = null;
    errorType.value = null;

    try {
      const response = await $fetch<LandslideData>(
        `${apiUrl}/landslide/${community}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );

      if (response?.error_code === 409) {
        const timestamp = (response as any).timestamp;
        if (timestamp) {
          const lastUpdate = new Date(timestamp);
          const sinceLastUpdate = formatDistanceToNow(lastUpdate);
          error.value = `The data is out of sync. It has been ${sinceLastUpdate} since the last update.`;
        } else {
          error.value = "The data is out of sync";
        }
        errorType.value = "data";
        communityLandslideData.value = null;
        return;
      }

      communityLandslideData.value = response;
      error.value = null;
      errorType.value = null;
    } catch (err: any) {
      console.error("Failed to fetch landslide data:", err);

      if (err.statusCode === 500) {
        error.value =
          "Unable to format the data from the database. Please try again later.";
        errorType.value = "critical";
        communityLandslideData.value = null;
        return;
      }

      if (err.statusCode === 502) {
        error.value =
          "The database is currently inaccessible. Please try again later.";
        errorType.value = "critical";
        communityLandslideData.value = null;
        return;
      }

      error.value = "Failed to fetch landslide data. Please try again.";
      communityLandslideData.value = null;
    } finally {
      loading.value = false;
    }
  };

  const getRiskLevelText = (riskLevel: number): string => {
    const riskLevels: Record<number, string> = {
      0: "Low",
      1: "Medium",
      2: "High",
    };

    return riskLevels[riskLevel] || "Unknown";
  };

  const getCommunityName = (communityId: CommunityId): string | null => {
    return communityLandslideData.value?.community?.name || null;
  };

  const getCommunityLocation = (communityId: CommunityId) => {
    if (communityLandslideData.value?.community) {
      return {
        name: communityLandslideData.value.community.name,
        lat: communityLandslideData.value.community.latitude,
        lng: communityLandslideData.value.community.longitude,
      };
    }
    return null;
  };

  return {
    data: readonly(communityLandslideData),
    loading: readonly(loading),
    error: readonly(error),
    errorType: readonly(errorType),
    fetchLandslideData,
    getRiskLevelText,
    getCommunityName,
    getCommunityLocation,
  };
});
