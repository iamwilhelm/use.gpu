import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as WGSL from '@use-gpu/wgsl-loader/rollup'
import rollupWGSL from '@use-gpu/wgsl-loader/rollup'
console.log(rollupWGSL, rollupWGSL())

export default defineConfig({
  esbuild: {
    include: ['*.ts', '*.jsx', '*.tsx', '*.wgsl'],
    loader: {'.wgsl': 'text'},
  },
  plugins: [rollupWGSL(), react()],
})
