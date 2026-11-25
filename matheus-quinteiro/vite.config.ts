import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preact no lugar do React em produção: mesma API, ~40 KB a menos de JavaScript.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom/client': 'preact/compat/client',
      'react-dom/server': 'preact/compat/server',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  ssr: { noExternal: true },
  build: { target: 'es2020', cssCodeSplit: false, modulePreload: { polyfill: false } },
})
