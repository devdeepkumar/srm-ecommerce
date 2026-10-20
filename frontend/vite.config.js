import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://srm-ecommerce-e3wo.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // 1️⃣ React ecosystem — MUST BE FIRST, MUST BE ONE CHUNK
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/") ||
            id.includes("/react-is/") ||
            id.includes("/scheduler/")
          ) {
            return "vendor-react";
          }

          // 2️⃣ Redux ecosystem
          if (
            id.includes("/@reduxjs/") ||
            id.includes("/react-redux/")
          ) {
            return "vendor-redux";
          }

          // 3️⃣ Heavy standalone libs
          if (id.includes("/xlsx/")) return "vendor-xlsx";
          if (id.includes("/country-state-city/")) return "vendor-geo";
          if (id.includes("/recharts/")) return "vendor-charts";
          if (id.includes("/@mui/")) return "vendor-mui";

          // 4️⃣ Baaki sab
          return "vendor";
        },
      },
    },
  },
});