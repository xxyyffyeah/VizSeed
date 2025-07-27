import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './web',
  plugins: [react()],
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