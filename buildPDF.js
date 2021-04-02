const puppeteer = require('puppeteer');
const theme = require('./theme');
const resume = require('./resume.json');

async function main() {
  const { render, pdfRenderOptions } = theme;

  const html = await render(resume);
  const browser = await puppeteer.launch({
    args: [],
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.setViewport({
    height: 1080,
    width: 1920,
  });
  // eslint-disable-next-line no-console
  console.debug({ browser, viewport: page.viewport() });
  await page.emulateMediaType('print');
  await page.goto(
    `data:text/html;base64,${Buffer.from(
      unescape(encodeURIComponent(html)),
    ).toString('base64')}`,
    { waitUntil: 'networkidle0' },
  );

  await page.pdf({
    format: 'a4',
    path: 'docs/resume.pdf',
    printBackground: true,
    ...pdfRenderOptions,
  });

  await page.screenshot({
    fullPage: true,
    path: 'docs/resume.png',
  });

  await browser.close();
}

main();
