import { defineStore } from "pinia";
import { ref } from "vue";
import { type CommunityId, type LandslideData } from "~/types/custom";
import { formatDistanceToNow } from "date-fns";

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && (value === "AK91" || value === "AK182");
}

export const useDataStore = defineStore("data", () => {
  const data = ref<LandslideData | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Get API URL from Nuxt runtime config
  const { $config } = useNuxtApp();
  const apiUrl = $config.public.snapApiUrl;

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
        const timestamp = (response as any).timestamp;
        if (timestamp) {
          const lastUpdate = new Date(timestamp);
          const timeString = formatDistanceToNow(lastUpdate);
          error.value = `The data is out of sync. It has been ${timeString} since the last update.`;
        } else {
          error.value = "The data is out of sync";
        }
        data.value = null;
        return;
      }

      data.value = response;
      error.value = null;
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

  const getRiskLevelText = (riskLevel: number): string => {
    const riskLevels: Record<number, string> = {
      0: "Low",
      1: "Medium",
      2: "High",
    };

    return riskLevels[riskLevel] || "Unknown";
  };

  const getCommunityName = (communityId: CommunityId): string | null => {
    // This is to allow for the community name to still be returned
    // for the title even if the API data fails to load.
    return (
      data.value?.community?.name ||
      ("AK91" === communityId ? "Craig" : "Kasaan")
    );
  };

  const getCommunityLocation = (communityId: CommunityId) => {
    if (data.value?.community) {
      return {
        name: data.value.community.name,
        lat: data.value.community.latitude,
        lng: data.value.community.longitude,
      };
    }
    return null;
  };

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetchLandslideData,
    getRiskLevelText,
    getCommunityName,
    getCommunityLocation,
  };
});
