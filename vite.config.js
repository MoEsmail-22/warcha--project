import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwincss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwincss()],
  //  resolve: {
  //     alias: {
  //       "@": path.resolve(__dirname, "./src"),
  //     },
  //   },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
