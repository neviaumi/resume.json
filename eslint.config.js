import { useCodeSortingEslintConfig } from '@busybox/eslint-config-code-sorting';
import { useESModuleEslintConfig } from '@busybox/eslint-config-esm';
import { useTailwindCSSEslintConfig } from '@busybox/eslint-config-tailwindcss';
import {
  useJSONEslintConfig,
  usePackageJsonEslintConfig,
  useYamlEslintConfig,
} from '@busybox/eslint-config-text-document';
import globals from 'globals';

import pkgjson from './package.json' with { type: 'json' };

export default [
  {
    ignores: ['package-lock.json', 'docs/**/*.md', 'dist/**/*'],
    name: pkgjson.name,
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    name: pkgjson.name,
  },
  useESModuleEslintConfig(),
  useCodeSortingEslintConfig(),
  useTailwindCSSEslintConfig({
    files: ['src/**/*.js'],
  }),
  useYamlEslintConfig(),
  useJSONEslintConfig(),
  usePackageJsonEslintConfig(),
].flat();
