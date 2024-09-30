import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chunk-TPTKQFMQ.js?v=31800acf'] // Replace with the actual module name
  }
  
})
