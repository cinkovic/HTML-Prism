// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react({
//     // Enable React Fast Refresh
//     fastRefresh: true,
//   })],
// })




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
