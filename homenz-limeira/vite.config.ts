import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react-dom/client': 'preact/compat/client',
      'react-dom/server': 'preact/compat/server',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      react: 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  ssr: { noExternal: true },
  build: { cssCodeSplit: false, assetsInlineLimit: 0 },
})
