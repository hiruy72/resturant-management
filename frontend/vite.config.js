import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

// 2. VITE PROXY CONFIGURATION
// When frontend makes request to '/api/orders'
// Vite proxy redirects it to 'http://localhost:5000/api/orders'