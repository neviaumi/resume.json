import playwright from 'playwright';

const browser = await playwright.chromium.launch({
  args: ['--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(process.env.RESUME_DOMAIN ?? 'http://localhost:3000/');

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
