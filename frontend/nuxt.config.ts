// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],

  i18n: {
    lazy: true,
    langDir: "locales",
    strategy: "prefix_except_default",
    locales: [
      { code: "es", iso: "es-ES", file: "es.json", name: "Español" },
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
      { code: "fr", iso: "fr-FR", file: "fr.json", name: "Français" },
      { code: "de", iso: "de-DE", file: "de.json", name: "Deutsch" },
      { code: "pt", iso: "pt-PT", file: "pt.json", name: "Português" },
    ],
    defaultLocale: "es",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3001/api",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001/api",
    },
  },

  app: {
    head: {
      title: "Pro League - Gestión de Ligas y Torneos",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Plataforma para administrar ligas deportivas, torneos, equipos y estadísticas en tiempo real",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  // Compatibilidad con Node.js 20.14.0
  compatibilityDate: "2024-11-10",

  // Optimizaciones para producción
  nitro: {
    compressPublicAssets: true,
  },

  // Mejor experiencia de desarrollo
  experimental: {
    payloadExtraction: false,
  },
});
