const puppeteer = require('puppeteer');
const theme = require('./theme');
const resume = require('./resume.json');

async function main() {
  const { render, pdfRenderOptions } = theme;

  const html = await render(resume);
  const browser = await puppeteer.launch({
    args: [],
  });
  const page = await browser.newPage();

  await page.emulateMediaType(pdfRenderOptions.mediaType);
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
    ...theme.pdfRenderOptions,
  });

  await browser.close();
}

main();
