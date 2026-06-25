import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ponytail: base './' so the static build works behind any path on your server
export default defineConfig({
  plugins: [react()],
  base: './',
})
