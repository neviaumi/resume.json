/* eslint-disable no-console */
const path = require('path');
const playwright = require('playwright');

async function main() {
  const htmlFile = path.resolve('./docs/index.html');

  const browser = await playwright.chromium.launch({
    args: ['--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });

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
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
