import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { headTags } from './src/lib/seo'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'odonto-prevent-head',
      transformIndexHtml: (html) => html.replace('<!--HEAD-->', headTags()),
    },
  ],
  build: { target: 'es2020', cssMinify: true },
})
