// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { languages } from "./src/i18n/translations";
import react from "@astrojs/react";
// import glsl from "vite-plugin-glsl";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://jaime02.github.io",
  // base: "/WebTaller/",
  integrations: [react({
    experimentalReactChildren: true,
  })],
  i18n: {
    locales: Object.keys(languages),
    defaultLocale: "en",
  },
  vite: {
    plugins: [
      // glsl(),
      tailwindcss(),
    ],
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: "[ext]/[name][extname]",
          entryFileNames: "script/entry.js",
        },
      },
      cssCodeSplit: false,
    },
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
  },
});
