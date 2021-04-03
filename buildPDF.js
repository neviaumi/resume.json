/* eslint-disable no-console */
const playwright = require('playwright');
const theme = require('./theme');
const resume = require('./resume.json');

async function main() {
  const { render, pdfRenderOptions } = theme;

  const html = await render(resume);
  const browser = await playwright.chromium.launch({
    args: ['--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  await page.goto(
    `data:text/html;base64,${Buffer.from(
      unescape(encodeURIComponent(html)),
    ).toString('base64')}`,
    { waitUntil: 'networkidle0' },
  );

  await page.pdf({
    format: 'a4',
    margin: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    path: 'docs/resume.pdf',
    printBackground: true,
    ...pdfRenderOptions,
  });

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
