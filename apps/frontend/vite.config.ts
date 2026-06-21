import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 16000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname , './src/presentacion'),
      '@app': path.resolve(__dirname , './src/presentacion/app'),
      '@features': path.resolve(__dirname , './src/presentacion/features'),
      '@layout': path.resolve(__dirname , './src/presentacion/layout'),
      '@pages': path.resolve(__dirname , './src/presentacion/pages'),
      '@shared': path.resolve(__dirname , './src/presentacion/shared'),
      '@widgets': path.resolve(__dirname , './src/presentacion/widgets')
    }
  }
})
