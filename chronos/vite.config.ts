import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: { target: 'es2020', cssCodeSplit: false, modulePreload: { polyfill: false } }
})
