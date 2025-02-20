import tailwindCssConfig from '@busybox/tailwindcss-config';
import { withColors } from '@busybox/tailwindcss-config/themes/colors';
import { withSpacing } from '@busybox/tailwindcss-config/themes/spacing';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./web-components/**/*.js', './index.html'],
  presets: [withSpacing(withColors(tailwindCssConfig))],
  theme: {
    fontWeight: {
      black: '900',
      bold: '700',
      light: '300',
      medium: '500',
      regular: '400',
      thin: '100',
    },
  },
};

export default config;
