import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './web',
  base: process.env.NODE_ENV === 'production' ? '/VizSeed/' : '/',
  plugins: [react()],
  build: {
    outDir: '../dist-web',
    target: 'es2015',
    sourcemap: true
  },
  publicDir: false, // 禁用默认的public目录
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
      'vizseed': path.resolve(__dirname, 'src/index.ts')
    }
  }
});