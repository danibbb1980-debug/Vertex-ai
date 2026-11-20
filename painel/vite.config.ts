/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@supabase")) return "supabase";
          if (/recharts|d3-|victory|immer|redux|reselect|es-toolkit|decimal\.js/.test(id)) return "charts";
          if (/react|scheduler/.test(id)) return "react";
          return "vendor";
        },
      },
    },
  },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
