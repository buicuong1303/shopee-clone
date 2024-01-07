import { defineConfig } from 'vitest/config'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [visualizer()],
  test: {
    environment: 'jsdom'
  },
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      //cho terminal hiểu src/ là cái gì
      src: path.resolve(__dirname, './src')
    }
  }
})
