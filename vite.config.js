import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/fcapi': {
        target: 'https://10.89.202.203:7012',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fcapi/, '/FCAPIService'),
      },
    },
  },
})
