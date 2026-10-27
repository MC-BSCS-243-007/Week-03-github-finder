import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base keeps the build portable on GitHub Pages project sites.
export default defineConfig({
  base: './',
  plugins: [react()],
})
