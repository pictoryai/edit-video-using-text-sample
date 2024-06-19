import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 9000
  },
  preview: {
    open: true,
    port: 9001,
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    global: 'window',
  },
});
