import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona requisições que começam com /api/v1/medicos para o backend PHP
      '^/api/v1/medicos': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
