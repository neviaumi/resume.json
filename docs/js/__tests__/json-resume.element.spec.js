import { promises as fs } from 'node:fs';

import { expect, test } from '../__tests__.helper.js';

async function expectAllElementCanBeenLocated(page) {
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
}

test.describe('Test json resume component', () => {
  test('render json resume on index page', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('json-resume');
    await expectAllElementCanBeenLocated(page);
  });
  test('render json resume and contain all elements @debug', async ({
    renderElement,
  }) => {
    const resume = JSON.parse(await fs.readFile('docs/resume.json', 'utf-8'));
    const page = await renderElement(
      '/js/json-resume.element.js',
      'json-resume',
      {
        resume,
      },
    );
    await page.waitForSelector('json-resume');
    await expectAllElementCanBeenLocated(page);
  });
});
