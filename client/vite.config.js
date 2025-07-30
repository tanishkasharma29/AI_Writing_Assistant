import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ Full fix for "buffer.Buffer" + Tailwind + React
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    "process.env": {}, // Prevent Vite from crashing on missing env
  },
  resolve: {
    alias: {
      buffer: "buffer/", // Fix for externalized 'buffer' module
    },
  },
  optimizeDeps: {
    include: ["buffer"], // Ensure it's included in pre-bundling
  },
});
