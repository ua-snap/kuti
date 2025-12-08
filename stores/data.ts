import { defineStore } from "pinia";
import { ref } from "vue";
import { type CommunityId, type LandslideData } from "~/types/custom";

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && (value === "AK91" || value === "AK182");
}

const COMMUNITY_LOCATIONS: Record<
  CommunityId,
  { name: string; lat: number; lng: number; zoom: number }
> = {
  AK91: { name: "Craig", lat: 55.476389, lng: -133.147778, zoom: 13 },
  AK182: { name: "Kasaan", lat: 55.541667, lng: -132.401944, zoom: 13 },
};

export const useDataStore = defineStore("data", () => {
  const data = ref<LandslideData | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Get API URL from Nuxt runtime config
  const { $config } = useNuxtApp();
  const apiUrl = $config.public.snapApiUrl;

  const formatTimeDifference = (diffMs: number): string => {
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;

      if (remainingMins > 0) {
        return `${hours} hour${
          hours > 1 ? "s" : ""
        } and ${remainingMins} minute${remainingMins > 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      }
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };

  const fetchLandslideData = async (community: CommunityId): Promise<void> => {
    if (!community) {
      error.value = "No community selected. Please choose Craig or Kasaan.";
      return;
    }

    loading.value = true;
    error.value = null;

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

      if (
        response &&
        typeof response === "object" &&
        (response as any).error_code === 409
      ) {
        // Calculate time since last update if timestamp is provided
        const timestamp = (response as any).timestamp;
        if (timestamp) {
          const now = new Date();
          const lastUpdate = new Date(timestamp);
          const timeSinceUpdate = now.getTime() - lastUpdate.getTime();
          const timeString = formatTimeDifference(timeSinceUpdate);
          error.value = `The data is out of sync. It has been ${timeString} since the last update.`;
        } else {
          error.value = "The data is out of sync";
        }
        data.value = null;
        return;
      }
    } catch (err: any) {
      console.error("Failed to fetch landslide data:", err);

      if (err.statusCode === 500) {
        error.value =
          "Unable to format the data from the database. Please try again later.";
        data.value = null;
        return;
      }

      if (err.statusCode === 502) {
        error.value =
          "The database is currently inaccessible. Please try again later.";
        data.value = null;
        return;
      }

      error.value = "Failed to fetch landslide data. Please try again.";
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();

      if (diffMs < 1440 * 60 * 1000) {
        return formatTimeDifference(diffMs) + " ago";
      } else {
        // For dates older than a day, show the local time
        return date.toLocaleString();
      }
    } catch (error) {
      return "Unknown time";
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

  const getCommunityName = (communityId: CommunityId): string => {
    return COMMUNITY_LOCATIONS[communityId].name;
  };

  const getCommunityLocation = (communityId: CommunityId) => {
    return COMMUNITY_LOCATIONS[communityId];
  };

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetchLandslideData,
    formatTimestamp,
    getRiskLevelText,
    getCommunityName,
    getCommunityLocation,
  };
});
