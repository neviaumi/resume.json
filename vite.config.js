import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/resume.json',
    esbuild: {
      supported: {
        'top-level-await': true,
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env['PORT'] ?? '3000'),
    },
  };
});
