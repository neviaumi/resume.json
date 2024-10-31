import playwright from 'playwright';
import { createServer } from 'vite';

const resumePdf = 'public/resume.pdf';

const server = await createServer();
await server.listen();

const browser = await playwright.chromium.launch({
  args: ['--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto('http://localhost:3000/');

await page.pdf({
  format: 'a4',
  margin: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  path: resumePdf,
  preferCSSPageSize: true,
  printBackground: true,
});

await browser.close();
await server.close();
