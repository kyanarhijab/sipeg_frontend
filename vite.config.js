import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    
    proxy: {
      '/api': {
        target: 'http://sipeg.ndp-tech.my.id',
        changeOrigin: true,
        secure: false
      }
    }
  },

  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});