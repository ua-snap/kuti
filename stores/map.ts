import { defineStore } from "pinia";
import { ref } from "vue";
import { useLandslideApiStore } from "~/stores/landslideApi";
import { type CommunityId, communityLocations } from "~/types/custom";

export const useMapStore = defineStore("map", () => {
  const { $L } = useNuxtApp();
  const landslideApiStore = useLandslideApiStore();
  const selectedCommunity = ref<CommunityId | null>(null);
  var map = markRaw({}); // We don't want this to be reactive.

  const setLocation = (communityId: CommunityId) => {
    selectedCommunity.value = communityId;
  };

  const clearMap = () => {
    if (map.value) {
      map.remove();
      map = null;
    }
  };

  const switchLocation = () => {
    clearMap();
    selectedCommunity.value = null;
  };

  const initializeMap = () => {
    clearMap();

    if (!selectedCommunity.value) return;

    map = $L.map("map", {
      zoom: 14,
      center: $L.latLng(
        communityLocations[selectedCommunity.value].lat,
        communityLocations[selectedCommunity.value].lng,
      ),
      scrollWheelZoom: false,
      zoomControl: true,
      doubleClickZoom: false,
      touchZoom: false,
      dragging: true,
      attributionControl: false,
    });

    // Expose map for testing in non-production environments
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      (window as any).__leafletMap = map;
    }

    const baseLayer = $L.tileLayer(
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
    );

    baseLayer.addTo(map);

    const kutiLayersConfig = [
      { name: "kuti:craig_hillshade", opacity: 1.0 },
      { name: "kuti:kasaan_hillshade", opacity: 1.0 },
      { name: "kuti:streams", opacity: 1.0 },
      { name: "kuti:runout", opacity: 1.0 },
      { name: "kuti:initiation", opacity: 1.0 },
      { name: "kuti:tongass", opacity: 1.0 },
      { name: "kuti:roads_and_paths", opacity: 1.0 },
    ];

    kutiLayersConfig.forEach((layerConfig) => {
      const wmsLayer = $L.tileLayer.wms(
        "https://gs.earthmaps.io/geoserver/kuti/wms",
        {
          layers: layerConfig.name,
          format: "image/png",
          transparent: true,
          version: "1.1.0",
          crs: $L.CRS.EPSG3857,
          opacity: layerConfig.opacity,
        },
      );
      wmsLayer.addTo(map);
    });
  };

  return {
    selectedCommunity,
    setLocation,
    switchLocation,
    initializeMap,
  };
});
