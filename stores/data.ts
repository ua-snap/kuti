import { defineStore } from "pinia";
import { ref } from "vue";
import { VALID_COMMUNITIES, type CommunityId } from "~/types/custom";

const COMMUNITY_LOCATIONS: Record<
  CommunityId,
  { name: string; lat: number; lng: number; zoom: number }
> = {
  AK91: { name: "Craig", lat: 55.476389, lng: -133.147778, zoom: 13 },
  AK182: { name: "Kasaan", lat: 55.541667, lng: -132.401944, zoom: 13 },
};

export interface LandslideData {
  expires_at: string;
  precipitation_24hr: number;
  precipitation_2days: number;
  precipitation_3days: number;
  precipitation_inches: number;
  precipitation_mm: number;
  risk_24hr: number;
  risk_2days: number;
  risk_3days: number;
  risk_level: number;
  timestamp: string;
}

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
      error.value = `No community selected. Please choose ${VALID_COMMUNITIES.join(
        " or ",
      )}.`;
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

      if (typeof response === "string") {
        throw new Error(
          "The data received from the server is corrupted or improperly formatted. Please try again later.",
        );
      }

      if (!response || typeof response !== "object" || !response.expires_at) {
        throw new Error("Invalid response format from server");
      }

      const now = new Date();
      const expiresAt = new Date(response.expires_at);

      if (isNaN(expiresAt.getTime())) {
        throw new Error("Invalid expires_at date format in response data");
      }

      if (now > expiresAt) {
        const lastUpdate = new Date(response.timestamp);
        const timeSinceUpdate = now.getTime() - lastUpdate.getTime();
        const timeString = formatTimeDifference(timeSinceUpdate);

        error.value = `The upstream data sources were unable to be updated. It has been ${timeString} since the last update.`;
        data.value = null;
      } else {
        data.value = response;
        error.value = null;
      }
    } catch (err: any) {
      console.error("Failed to fetch landslide data:", err);

      const isJsonError =
        err instanceof Error &&
        (err.message.includes("JSON") ||
          err.message.includes("parse") ||
          err.message.includes("Unexpected token") ||
          err.message.includes("SyntaxError") ||
          err.message.toLowerCase().includes("json") ||
          err.name === "SyntaxError" ||
          err.message.includes("corrupted or improperly formatted"));

      const isNetworkError =
        err instanceof Error &&
        (err.message.includes("network") ||
          err.message.includes("fetch") ||
          err.message.includes("aborted") ||
          err.message.includes("abort") ||
          err.name === "AbortError" ||
          (err.cause as any)?.name === "AbortError") &&
        // Exclude HTTP status errors (which have statusCode)
        !(err as any).statusCode;

      if (isJsonError) {
        error.value =
          "The data received from the server is corrupted or improperly formatted. Please try again later.";
      } else if (isNetworkError) {
        error.value =
          "Network error occurred while fetching data. Please check your connection and try again.";
      } else {
        error.value = "Failed to fetch landslide data. Please try again.";
      }

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
