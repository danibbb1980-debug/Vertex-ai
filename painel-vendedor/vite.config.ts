/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // React + supabase-js + React Query somam ~160 kB gzip num chunk só; aceitável para um app privado.
  build: { chunkSizeWarningLimit: 650 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
