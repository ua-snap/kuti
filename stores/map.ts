import { defineStore } from "pinia";
import { ref } from "vue";
import { COMMUNITY_LOCATIONS } from "~/utils/luts";

export const useMapStore = defineStore("map", () => {
  const { $L } = useNuxtApp();
  const selectedLocation = ref<string | null>(null);
  const map = ref<any>(null);

  const setLocation = (name: string) => {
    selectedLocation.value = name;
  };

  const clearMap = () => {
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
  };

  const switchLocation = () => {
    clearMap();
    selectedLocation.value = null;
  };

  const initializeMap = () => {
    clearMap();

    if (!selectedLocation.value) return;

    const location =
      COMMUNITY_LOCATIONS[
        selectedLocation.value as keyof typeof COMMUNITY_LOCATIONS
      ];
    if (!location) return;

    map.value = $L.map("map", {
      zoom: location.zoom,
      center: $L.latLng(location.lat, location.lng),
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
    selectedLocation,
    setLocation,
    switchLocation,
    initializeMap,
  };
});
