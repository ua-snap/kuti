import { defineStore } from "pinia";
import { ref } from "vue";
import {
  type CommunityId,
  type LandslideData,
  ApiResponse,
} from "~/types/custom";

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && (value === "AK91" || value === "AK182");
}

export const useLandslideApiStore = defineStore("landslideApi", () => {
  const communityLandslideData = ref<LandslideData | null>(null);
  const loading = ref<boolean>(false);
  const httpError = ref<number | null>(null);

  const { $config } = useNuxtApp();
  const apiUrl = $config.public.snapApiUrl;

  const fetchLandslideData = async (community: CommunityId): Promise<void> => {
    loading.value = true;

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

      communityLandslideData.value = response;
    } catch (err: any) {
      console.error("Failed to fetch landslide data:", err);
      console.log("Error status code:", err.statusCode);

      if (err.statusCode === 409) {
        httpError.value = ApiResponse.API_HTTP_RESPONSE_STALE_DATA;
        console.log("Setting httpError to 409:", httpError.value);
      } else if (err.statusCode === 502) {
        httpError.value = ApiResponse.API_HTTP_RESPONSE_DATABASE_UNREACHABLE;
      } else {
        httpError.value = ApiResponse.API_HTTP_RESPONSE_GENERAL_ERROR;
      }
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
    httpError: readonly(httpError),
    fetchLandslideData,
    getRiskLevelText,
    getCommunityName,
    getCommunityLocation,
  };
});
