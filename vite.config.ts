import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact(), tsconfigPaths()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://apsp-be.lapinlearn.edu.vn",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
