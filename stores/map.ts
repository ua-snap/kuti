import { defineStore } from "pinia";
import { ref } from "vue";
import { type CommunityId, communityLocations } from "~/types/custom";

interface MapLayer {
  id: string;
  displayName: string;
  layerName: string | string[];
  visible: boolean;
  leafletLayer?: any;
  leafletLayers?: any[];
}

export const useMapStore = defineStore("map", () => {
  const { $L, $config } = useNuxtApp();
  const geoserverUrl = $config.public.geoserverUrl;
  const selectedCommunity = ref<CommunityId | null>(null);
  var map = {};
  var communityMarkers = {};

  const INITIAL_ZOOM = 10;
  const INITIAL_CENTER_LAT = 55.5077;
  const INITIAL_CENTER_LNG = -132.5;

  const layers = ref<MapLayer[]>([
    {
      id: "hillshade",
      displayName: "Hillshade",
      layerName: ["kuti:craig_hillshade", "kuti:kasaan_hillshade"],
      visible: true,
    },
    {
      id: "streams",
      displayName: "Fish-Bearing Streams",
      layerName: "kuti:streams",
      visible: true,
    },
    {
      id: "tongass",
      displayName: "Tongass Forest Landslides",
      layerName: "kuti:tongass",
      visible: true,
    },
    {
      id: "runout",
      displayName: "Landslide Runout",
      layerName: "kuti:runout",
      visible: true,
    },
    {
      id: "initiation",
      displayName: "Landslide Initiation",
      layerName: "kuti:initiation",
      visible: true,
    },
    {
      id: "roads",
      displayName: "Roads and Paths",
      layerName: "kuti:roads_and_paths",
      visible: true,
    },
  ]);

  const setLocation = (communityId: CommunityId) => {
    selectedCommunity.value = communityId;
  };

  const toggleLayer = (layerId: string) => {
    const layer = layers.value.find((l) => l.id === layerId);
    if (!layer) return;

    layer.visible = !layer.visible;

    // Handle layers with multiple leaflet layers i.e. Hillshade
    if (layer.leafletLayers) {
      layer.leafletLayers.forEach((leafletLayer) => {
        if (layer.visible) {
          leafletLayer.addTo(map);
        } else {
          map.removeLayer(leafletLayer);
        }
      });
    } else if (layer.leafletLayer) {
      if (layer.visible) {
        layer.leafletLayer.addTo(map);
      } else {
        map.removeLayer(layer.leafletLayer);
      }
    }
  };

  const clearMap = () => {
    if (map.value) {
      map.remove();
      map = null;
    }
    communityMarkers = {};
  };

  const switchLocation = () => {
    clearMap();
    selectedCommunity.value = null;
  };

  const hideMarkers = () => {
    if (!map) return;

    Object.values(communityMarkers).forEach((marker: any) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
  };

  const refreshLayers = () => {
    if (!map) return;

    layers.value.forEach((layerConfig) => {
      if (layerConfig.leafletLayers) {
        layerConfig.leafletLayers.forEach((leafletLayer) => {
          const isOnMap = map.hasLayer(leafletLayer);
          if (layerConfig.visible && !isOnMap) {
            leafletLayer.addTo(map);
          } else if (!layerConfig.visible && isOnMap) {
            map.removeLayer(leafletLayer);
          }
        });
      } else if (layerConfig.leafletLayer) {
        const isOnMap = map.hasLayer(layerConfig.leafletLayer);
        if (layerConfig.visible && !isOnMap) {
          layerConfig.leafletLayer.addTo(map);
        } else if (!layerConfig.visible && isOnMap) {
          map.removeLayer(layerConfig.leafletLayer);
        }
      }
    });
  };

  const updateMarkerVisibility = () => {
    if (!map) return;

    // Only show the community name markers if zoomed out
    const currentZoom = map.getZoom();
    const showMarkers = currentZoom < 12;

    Object.values(communityMarkers).forEach((marker: any) => {
      if (showMarkers) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    });

    refreshLayers();
  };

  const zoomToCommunity = (communityId: CommunityId) => {
    if (map && communityLocations[communityId]) {
      selectedCommunity.value = communityId;

      layers.value.forEach((layerConfig) => {
        if (layerConfig.leafletLayers) {
          layerConfig.leafletLayers.forEach((layer) => {
            if (layer.getContainer()) {
              layer.getContainer().style.opacity = "0";
            }
          });
        } else if (layerConfig.leafletLayer) {
          if (layerConfig.leafletLayer.getContainer()) {
            layerConfig.leafletLayer.getContainer().style.opacity = "0";
          }
        }
      });

      map.flyTo(
        $L.latLng(
          communityLocations[communityId].lat,
          communityLocations[communityId].lng,
        ),
        14,
        {
          duration: 1.5,
        },
      );

      setTimeout(() => {
        // First redraw layers at new zoom level while still hidden
        layers.value.forEach((layerConfig) => {
          if (layerConfig.leafletLayers) {
            layerConfig.leafletLayers.forEach((layer) => {
              layer.redraw();
            });
          } else if (layerConfig.leafletLayer) {
            layerConfig.leafletLayer.redraw();
          }
        });

        // Wait for new tiles to load before showing layers
        setTimeout(() => {
          layers.value.forEach((layerConfig) => {
            if (layerConfig.leafletLayers) {
              layerConfig.leafletLayers.forEach((layer) => {
                if (layer.getContainer()) {
                  layer.getContainer().style.opacity = "1";
                }
              });
            } else if (layerConfig.leafletLayer) {
              if (layerConfig.leafletLayer.getContainer()) {
                layerConfig.leafletLayer.getContainer().style.opacity = "1";
              }
            }
          });
        }, 300);
      }, 1500);
    }
  };

  const resetView = () => {
    if (map) {
      selectedCommunity.value = null;

      // Hide all WMS layers during animation to prevent flickering
      layers.value.forEach((layerConfig) => {
        if (layerConfig.leafletLayers) {
          layerConfig.leafletLayers.forEach((layer) => {
            if (layer.getContainer()) {
              layer.getContainer().style.opacity = "0";
            }
          });
        } else if (layerConfig.leafletLayer) {
          if (layerConfig.leafletLayer.getContainer()) {
            layerConfig.leafletLayer.getContainer().style.opacity = "0";
          }
        }
      });

      map.flyTo(
        $L.latLng(INITIAL_CENTER_LAT, INITIAL_CENTER_LNG),
        INITIAL_ZOOM,
        {
          duration: 1.5,
        },
      );

      setTimeout(() => {
        updateMarkerVisibility();

        // First redraw layers at new zoom level while still hidden
        layers.value.forEach((layerConfig) => {
          if (layerConfig.leafletLayers) {
            layerConfig.leafletLayers.forEach((layer) => {
              layer.redraw();
            });
          } else if (layerConfig.leafletLayer) {
            layerConfig.leafletLayer.redraw();
          }
        });

        // Wait for new tiles to load before showing layers
        setTimeout(() => {
          layers.value.forEach((layerConfig) => {
            if (layerConfig.leafletLayers) {
              layerConfig.leafletLayers.forEach((layer) => {
                if (layer.getContainer()) {
                  layer.getContainer().style.opacity = "1";
                }
              });
            } else if (layerConfig.leafletLayer) {
              if (layerConfig.leafletLayer.getContainer()) {
                layerConfig.leafletLayer.getContainer().style.opacity = "1";
              }
            }
          });
        }, 300);
      }, 1500);
    }
  };

  const initializeMap = () => {
    clearMap();

    map = $L.map("map", {
      zoom: INITIAL_ZOOM,
      minZoom: 9,
      maxZoom: 15,
      center: $L.latLng(INITIAL_CENTER_LAT, INITIAL_CENTER_LNG),
      scrollWheelZoom: false,
      zoomControl: true,
      doubleClickZoom: false,
      touchZoom: false,
      dragging: true,
      attributionControl: false,
    });

    if (typeof window !== "undefined") {
      (window as any).__leafletMap = map;
    }

    const baseLayer = $L.tileLayer(
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
    );

    baseLayer.addTo(map);

    map.on("zoomstart", hideMarkers);
    map.on("zoomend", updateMarkerVisibility);

    const communityMarkersData = [
      { id: "AK91" as CommunityId, name: "Craig" },
      { id: "AK182" as CommunityId, name: "Kasaan" },
    ];

    communityMarkersData.forEach((community) => {
      const customIcon = $L.divIcon({
        className: "community-marker",
        html: `<div class="circle-marker">${community.name}</div>`,
        iconSize: [80, 40],
        iconAnchor: [40, 20],
      });

      const marker = $L.marker(
        [
          communityLocations[community.id].lat,
          communityLocations[community.id].lng,
        ],
        {
          icon: customIcon,
          title: community.name,
        },
      );

      marker.on("click", () => {
        zoomToCommunity(community.id);
      });

      marker.addTo(map);

      communityMarkers[community.id] = marker;
    });

    updateMarkerVisibility();

    layers.value.forEach((layerConfig) => {
      if (Array.isArray(layerConfig.layerName)) {
        const leafletLayers: any[] = [];

        layerConfig.layerName.forEach((layerName) => {
          const wmsLayer = $L.tileLayer.wms(geoserverUrl, {
            layers: layerName,
            format: "image/png",
            transparent: true,
            version: "1.1.0",
            crs: $L.CRS.EPSG3857,
          });

          leafletLayers.push(wmsLayer);

          if (layerConfig.visible) {
            wmsLayer.addTo(map);
          }
        });

        layerConfig.leafletLayers = leafletLayers;
      } else {
        const wmsLayer = $L.tileLayer.wms(geoserverUrl, {
          layers: layerConfig.layerName,
          format: "image/png",
          transparent: true,
          version: "1.1.0",
          crs: $L.CRS.EPSG3857,
        });

        layerConfig.leafletLayer = wmsLayer;

        if (layerConfig.visible) {
          wmsLayer.addTo(map);
        }
      }
    });
  };

  return {
    selectedCommunity,
    layers,
    setLocation,
    switchLocation,
    initializeMap,
    toggleLayer,
    zoomToCommunity,
    resetView,
  };
});
