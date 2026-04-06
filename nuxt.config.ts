// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: [
    "bulma/css/bulma.min.css",
    "leaflet/dist/leaflet.css",
    "~/assets/css/main.css",
  ],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  pages: true,
  app: {
    head: {
      meta: [
        {
          name: "color-scheme",
          content: "light",
        },
      ],
      script: [
        {
          src: "https://umami.snap.uaf.edu/script.js",
          async: true,
          "data-website-id": "57573294-19a7-419c-84d1-b8d3e7c3bc16",
          "data-domains": "aklandslides.org",
          "data-do-not-track": "true",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      geoserverUrl:
        process.env.GEOSERVER_URL || "https://gs.earthmaps.io/geoserver/wms",
      snapApiUrl: process.env.SNAP_API_URL || "https://earthmaps.io",
    },
  },
});
