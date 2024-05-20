import busyboxEslintConfig, { globals } from '@busybox/eslint-config';

export default [
  {
    ignores: ['package-lock.json'],
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
];
