// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "shadcn-nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts"
  ],
  app: {
    head: {
      charset: "utf-8",
      title: "BKO-Seite",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ]
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: ''
  },
  googleFonts: {
    preload: true,
    families: {
      Quicksand: "300..700",
    },
  },
});