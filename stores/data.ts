import { defineStore } from "pinia";
import { ref } from "vue";

export interface LandslideData {
  expires_at: string;
  hour: string;
  place_name: string;
  precipitation_24hr: number;
  precipitation_2days: number;
  precipitation_3days: number;
  precipitation_inches: number;
  precipitation_mm: number;
  risk_24hr: number;
  risk_2days: number;
  risk_3days: number;
  risk_is_elevated_from_previous: boolean;
  risk_level: number;
  risk_probability: number;
  timestamp: string;
}

export const useDataStore = defineStore("data", () => {
  const data = ref<LandslideData | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Get API URL from Nuxt runtime config
  const { $config } = useNuxtApp();
  const apiUrl = $config.public.snapApiUrl;

  const fetchLandslideData = async (community: string): Promise<void> => {
    if (!community || (community !== "Kasaan" && community !== "Craig")) {
      error.value =
        "Invalid community selected. Please choose 'Kasaan' or 'Craig'.";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<LandslideData>(
        `${apiUrl}/landslide/${community}`,
      );
      data.value = response;
    } catch (err) {
      console.error("Failed to fetch landslide data:", err);
      error.value = "Failed to fetch landslide data. Please try again.";
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  const clearData = (): void => {
    data.value = null;
    error.value = null;
    loading.value = false;
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      // Parse the UTC timestamp
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        return "Just now";
      } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
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

  return {
    // State
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    fetchLandslideData,
    clearData,
    formatTimestamp,
    getRiskLevelText,
  };
});
