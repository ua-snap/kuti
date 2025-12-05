// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["leaflet/dist/leaflet.css"],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  pages: true,
  runtimeConfig: {
    public: {
      snapApiUrl: process.env.SNAP_API_URL || "https://earthmaps.io",
    },
  },
});
