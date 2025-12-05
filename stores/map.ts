import { defineStore } from "pinia";
import { ref } from "vue";
import { useDataStore } from "~/stores/data";
import { type CommunityId } from "~/types/custom";

export const useMapStore = defineStore("map", () => {
  const { $L } = useNuxtApp();
  const dataStore = useDataStore();
  const selectedCommunity = ref<CommunityId | null>(null);
  const map = ref<any>(null);

  const setLocation = (communityId: CommunityId) => {
    selectedCommunity.value = communityId;
  };

  const clearMap = () => {
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
  };

  const switchLocation = () => {
    clearMap();
    selectedCommunity.value = null;
  };

  const initializeMap = () => {
    clearMap();

    if (!selectedCommunity.value) return;

    const communityData = dataStore.getCommunityLocation(
      selectedCommunity.value,
    );

    if (!communityData) return;

    map.value = $L.map("map", {
      zoom: communityData.zoom,
      center: $L.latLng(communityData.lat, communityData.lng),
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      touchZoom: false,
      dragging: true,
      attributionControl: false,
    });

    const baseLayer = $L.tileLayer(
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
    );

    baseLayer.addTo(map.value);
  };

  return {
    selectedCommunity,
    setLocation,
    switchLocation,
    initializeMap,
  };
});
