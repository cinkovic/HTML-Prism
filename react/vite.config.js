import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,    // Use polling for file changes
      interval: 100        // Check for changes every 100ms
    }
  },
})
