import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [svelte()],
  assetsInclude: ['**/*.tif'], // import .tif as url
  build: {
    target: "esnext" // for Top-level await
  }
})
