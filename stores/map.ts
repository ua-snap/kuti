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

    const craigHillshadeLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:craig_hillshade",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    const kasaanHillshadeLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:kasaan_hillshade",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    craigHillshadeLayer.addTo(map.value);
    kasaanHillshadeLayer.addTo(map.value);

    const streamsLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:streams",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    streamsLayer.addTo(map.value);

    // Add runout layer from Geoserver
    const runoutLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:runout",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 0.5,
      },
    );

    runoutLayer.addTo(map.value);
    // Add initiation layer from Geoserver
    const initiationLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:initiation",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    initiationLayer.addTo(map.value);

    // Add tongass layer from Geoserver
    const tongassLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:tongass",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    tongassLayer.addTo(map.value);

    // Add water bodies layer from Geoserver
    const roadAndPathsLayer = $L.tileLayer.wms(
      "https://gs.earthmaps.io/geoserver/kuti/wms",
      {
        layers: "kuti:roads_and_paths",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: $L.CRS.EPSG3857,
        opacity: 1.0,
      },
    );

    roadAndPathsLayer.addTo(map.value);
  };

  return {
    selectedCommunity,
    setLocation,
    switchLocation,
    initializeMap,
  };
});
