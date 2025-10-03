import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  publicDir: 'public',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
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
      '@': resolve(__dirname, 'frontend/src'),
      '@app': resolve(__dirname, 'frontend/src/app'),
      '@features': resolve(__dirname, 'frontend/src/features'),
      '@shared': resolve(__dirname, 'frontend/src/shared'),
      '@components': resolve(__dirname, 'frontend/src/shared/components'),
      '@types': resolve(__dirname, 'frontend/src/shared/types'),
      '@utils': resolve(__dirname, 'frontend/src/shared/utils'),
      '@api': resolve(__dirname, 'frontend/src/shared/api'),
      '@hooks': resolve(__dirname, 'frontend/src/shared/hooks'),
      '@assets': resolve(__dirname, 'frontend/src/assets'),
      '@config': resolve(__dirname, 'frontend/src/config'),
    },
  },
});
