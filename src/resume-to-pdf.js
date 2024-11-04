import playwright from 'playwright';
import { createServer } from 'vite';

export async function generateResumeToPDF(pdfPath, options = {}) {
  const server = await createServer({
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME': JSON.stringify(
        options?.useTailoredResume ?? false,
      ),
    },
  });
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
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
  });

  await browser.close();
  await server.close();
}
