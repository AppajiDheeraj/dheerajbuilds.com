import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || "https://portfolio-seven-ruby-98.vercel.app";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["gsap"],
  },
  optimizeDeps: {
    exclude: ["gsap", "@gsap/react"],
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      "appajis-mac-mini.tail450ebf.ts.net",
      "appaji-asus.tail450ebf.ts.net",
      "oneplus-nord-4.tail450ebf.ts.net"
    ],
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "build",
  },
});
