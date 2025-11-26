import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const { $L } = useNuxtApp();
  const selectedLocation = ref<string | null>(null);
  const map = ref<any>(null);

  const locations: Record<string, { lat: number; lng: number; zoom: number }> =
    {
      Craig: { lat: 55.476389, lng: -133.147778, zoom: 13 },
      Kassan: { lat: 55.541667, lng: -132.401944, zoom: 13 },
    };

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

    const location = locations[selectedLocation.value];

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
