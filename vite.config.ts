import { defineConfig } from 'vite';

export default defineConfig({
  root: './web',
  build: {
    outDir: '../dist-web',
    target: 'es2015',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});