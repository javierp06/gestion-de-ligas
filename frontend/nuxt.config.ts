// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n", "@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Pro League",
      short_name: "ProLeague",
      description: "Gestión de Ligas y Torneos Deportivos",
      theme_color: "#84CC16",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      type: "module",
    },
  },

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
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "985663130308-2sh4s4au3ugvlgui9u95okkb41irks55.apps.googleusercontent.com",
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
      script: [
        {
          children: `(function() {
            try {
              var storedTheme = localStorage.getItem('darkMode');
              var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (storedTheme === 'true' || (!storedTheme && systemDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })()`
        }
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
