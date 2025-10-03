import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/react',
  publicDir: resolve(__dirname, 'frontend/css'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/react'),
      '@components': resolve(__dirname, 'src/react/components'),
      '@pages': resolve(__dirname, 'src/react/pages'),
      '@types': resolve(__dirname, 'src/react/types'),
      '@hooks': resolve(__dirname, 'src/react/hooks'),
      '@utils': resolve(__dirname, 'src/react/utils'),
    },
  },
});
