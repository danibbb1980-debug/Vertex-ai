import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// React no código, Preact no pacote final (mesma API, ~10x menor): menos JS e menos bloqueio no celular.
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
  ssr: { noExternal: ['preact', 'preact-render-to-string'] },
  build: { cssCodeSplit: false, assetsInlineLimit: 0 },
})
