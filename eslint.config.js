import busyboxEslintConfig, { globals } from '@busybox/eslint-config';

export default [
  {
    ignores: [
      'package-lock.json',
      'llm/**/*',
      'docs/jd.md',
      'docs/draft-introduction.md',
    ],
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
