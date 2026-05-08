import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-05-08",
  devtools: { enabled: true },
  // Nuxt 4 source directory layout (`app/`).
  future: { compatibilityVersion: 4 },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  
  // MapLibre is strictly client-side; SSR pages can still render the rest
  // of the chrome (header, docs text). Map demos are wrapped in <ClientOnly>.
  ssr: true,
  app: {
    head: {
      title: "mapcn-vue",
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon.svg' },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Free & open-source map components for Vue. Zero config, built on MapLibre GL, styled with Tailwind, plays nice with shadcn-vue.",
        },
      ],
    },
  },
  components: [
    // Auto-import all .vue components (chrome + library), flat by basename.
    {
      path: "~/components",
      pathPrefix: false,
      extensions: ["vue"],
    },
  ],
  // Auto-import composables from the library + project composables.
  imports: {
    dirs: ["composables/**", "components/ui/map/composables/**"],
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
