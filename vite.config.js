import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Le indicamos explícitamente a Vite que solo analice index.html y la carpeta src
    entries: ['index.html', 'src/**/*.{js,jsx}'],
  },
  server: {
    watch: {
      ignored: ['**/backup_html/**'],
    },
  },
  // Configuración añadida para pruebas unitarias con Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});