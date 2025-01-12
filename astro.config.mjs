// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: 'https://jaime02.github.io',
  base: '/WebTaller/',
  integrations: [tailwind(), mdx(), react()],
});
