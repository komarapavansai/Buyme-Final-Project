import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server:{
    port: 5000,
    host: true,
    proxy:{
      '/api':{
        target: 'http://localhost:3500',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/notify':{
        target: 'http://localhost:3501',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notify/, '')
      }
    }
  }
})
