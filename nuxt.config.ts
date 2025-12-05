// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["leaflet/dist/leaflet.css"],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  pages: true,
  app: {
    head: {
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
});
