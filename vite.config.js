import { defineConfig } from 'vite';

export default defineConfig({
  base: '/resume.json',
  server: {
    host: '0.0.0.0',
    port: Number(process.env['PORT'] ?? '3000'),
  },
});
