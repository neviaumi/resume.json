import busyboxEslintConfig, { globals } from '@busybox/eslint-config';
import { useTailwindCSSEslintConfig } from '@busybox/eslint-config-tailwindcss';

export default [
  {
    ignores: ['package-lock.json', 'llm/**/*', 'docs/**/*.md', 'dist/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  ...busyboxEslintConfig,
  useTailwindCSSEslintConfig({
    files: ['src/**/*.js'],
  }),
];
