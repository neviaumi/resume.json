import { promises as fs } from 'node:fs';
import { URL } from 'node:url';

import playwright from 'playwright';
import { mergeDeepLeft } from 'ramda';

const flagForIsPrivate = process.argv[2];
const isPrivateBuild = flagForIsPrivate === '--private';
const domain = process.env.RESUME_DOMAIN ?? 'http://localhost:3000';
const path = isPrivateBuild ? '/index.private.html' : '/index.html';

if (isPrivateBuild) {
  const resumeJson = JSON.parse(await fs.readFile('docs/resume.json', 'utf-8'));
  const dataWantToIncludeInPrivateBuild = JSON.parse(
    await fs.readFile('docs/private.json', 'utf-8'),
  );
  const privateResume = mergeDeepLeft(
    resumeJson,
    dataWantToIncludeInPrivateBuild,
  );
  await fs.writeFile(
    'docs/resume.private.json',
    JSON.stringify(privateResume, null, 2),
  );
}

const browser = await playwright.chromium.launch({
  args: ['--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(new URL(path, domain).toString());

await page.pdf({
  format: 'a4',
  margin: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  path: isPrivateBuild ? 'docs/resume.private.pdf' : 'docs/resume.pdf',
  preferCSSPageSize: true,
  printBackground: true,
});

await browser.close();
