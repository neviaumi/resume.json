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
await page.goto('http://localhost:3000/', {
  waitUntil: 'networkidle',
});
await page.pdf({
  format: 'a4',
  path: resumePdf,
  preferCSSPageSize: true,
  printBackground: true,
});

await browser.close();
await server.close();
