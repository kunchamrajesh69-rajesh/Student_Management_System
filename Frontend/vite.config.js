import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        students: resolve(__dirname, 'students.html'),
        addStudent: resolve(__dirname, 'add-student.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
