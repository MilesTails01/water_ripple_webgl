import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Ensure paths are normalized for Windows
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});