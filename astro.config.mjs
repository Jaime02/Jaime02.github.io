// @ts-check
import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://jaime02.github.io",
  base: "/WebTaller/",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  vite: {
    plugins: [glsl()],
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
