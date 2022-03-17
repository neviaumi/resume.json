/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';
import playwright from 'playwright';

// https://github.com/eslint/eslint/discussions/15305 assert type not working meanwhile
// import resume from '../resume.json' assert { type: 'json' };
import { render } from './theme/index.js';

const resumePath = path.join(
  path.parse(new URL(import.meta.url).pathname).dir,
  '../',
  'resume.json',
);
const resume = await fs.readFile(resumePath, { encoding: 'utf-8' });
const html = await render(JSON.parse(resume));

const browser = await playwright.chromium.launch({
  args: ['--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.setContent(html, { waitUntil: 'networkidle0' });

await page.pdf({
  format: 'a4',
  margin: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  path: 'docs/resume.pdf',
  preferCSSPageSize: true,
  printBackground: true,
});

await browser.close();
