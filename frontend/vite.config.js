import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    port: 5173,
    host: true
  },
  preview: {
    historyApiFallback: true,
    port: 4173
  },
  build: {
    outDir: 'dist'
  }
})
