import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from /driftfield/ on GitHub Pages; dev stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/driftfield/' : '/',
  plugins: [react()],
  server: { port: 5180 },
}))
