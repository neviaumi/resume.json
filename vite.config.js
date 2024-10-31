import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env['PORT'] ?? '3000'),
  },
});
