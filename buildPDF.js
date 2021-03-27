// Dependence here come from resume-cli
const puppeteer = require('puppeteer');
const resume = require('./resume.json');
const theme = require('./theme');

// Function copy from https://github.com/jsonresume/resume-cli/blob/master/lib/export-resume.js#L77
/**
 * Can deleted if https://github.com/jsonresume/resume-cli/pull/537 merged
 * */
async function main() {
  const { pdfRenderOptions, pdfViewport } = theme;
  const html = await theme.render(resume);
  const browser = await puppeteer.launch({
    args: [],
  });
  const page = await browser.newPage();
  await page.emulateMediaType(pdfRenderOptions.mediaType);
  await page.goto(
    `data:text/html;base64,${Buffer.from(
      unescape(encodeURIComponent(html)),
    ).toString('base64')}`,
    {
      waitUntil: 'networkidle0',
    },
  );

  if (pdfViewport) {
    await page.setViewport(pdfViewport);
  }

  await page.pdf({
    format: 'A4',
    path: `docs/resume.pdf`,
    printBackground: true,
    ...pdfRenderOptions,
  });
  process.exit();
}

main();
