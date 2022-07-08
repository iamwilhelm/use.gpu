import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupWGSL from '@use-gpu/wgsl-loader/rollup'

export default defineConfig({
  optimizeDeps: {
    exclude: ["@use-gpu/wgsl", "lodash"],
    esbuildOptions: {
      loader: {'.wgsl': 'text'},
    },
  },
  plugins: [rollupWGSL(), react()],
})
