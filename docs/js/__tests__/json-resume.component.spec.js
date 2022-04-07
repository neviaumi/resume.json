import { expect, test as baseTest } from '@playwright/test';
import { promises as fs } from 'fs';

const test = baseTest.extend({
  page: async ({ baseURL, page }, use) => {
    const resume = await fs.readFile('docs/resume.json', 'utf-8');
    await page.setContent(`<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimal-ui">
  <title>Test resume</title>
  <script src="${baseURL}/js/json-resume.component.js" type="module"></script>
  <style>
      /*https://robdodson.me/posts/at-font-face-doesnt-work-in-shadow-dom/*/
      @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css");
        :root {
          font-size: 62.5%; /*Make compute rem more easily*/
        }
        body {
          font-size: 1.6rem; /*Restore default font size*/
        }
  </style>
  <script>
    window.addEventListener('load', () => {
          document.querySelector('json-resume').setAttribute("resume", JSON.stringify(${resume}));

    });
  </script>
</head>

<body>
  <json-resume />
</body>

</html>
`);
    await use(page);
  },
});

test.describe('Test json resume component', () => {
  test('render json resume and contain all elements', async ({ page }) => {
    await page.waitForSelector('json-resume');
    await page.pause();
    await expect(
      page.locator('[data-testid="resume-header-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-about-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-education-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-language-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-projects-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-references-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-skills-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-summary-element"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="resume-work-element"]'),
    ).toBeVisible();
  });
});
