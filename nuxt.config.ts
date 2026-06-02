// https://nuxt.com/docs/api/configuration/nuxt-config
var metas = {
  title: "Alaska Landslide Risk - Prince of Wales Island Communities",
  description:
    "Real-time landslide risk assessment for Prince of Wales Island communities in Alaska.",
  keywords:
    "Alaska landslides, Prince of Wales Island, Craig Alaska, Kasaan Alaska, landslide risk, landslide preparedness",
  preview: "/preview.png",
  url: "https://powlandslides.org",
};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["leaflet/dist/leaflet.css", "~/assets/css/main.scss"],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  pages: true,
  app: {
    head: {
      htmlAttrs: {
        "data-theme": "light",
        lang: "en",
      },
      title: "Prince of Wales Island Landslide Risk",
      meta: [
        { name: "description", content: metas.description },
        { name: "keywords", content: metas.keywords },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: metas.title },
        { property: "og:title", content: metas.title },
        { property: "og:description", content: metas.description },
        { property: "og:url", content: metas.url },
        { property: "og:image", content: metas.preview },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
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
