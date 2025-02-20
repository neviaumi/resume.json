import clsx from 'clsx';

import { date } from '../helpers.js';

export function renderEducationSection({ educations }) {
  return `
  <section aria-labelledby="resume-educations-section-header">
    <ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
      ${educations
        .map((education, index) => {
          const { area, endDate, institution, startDate, studyType, url } =
            education;

          return `
          <li class="${clsx(
            'tw-border-b tw-border-gray-200 tw-py-2 print:tw-break-inside-avoid',
          )}" title="${institution}">
            ${
              index === 0
                ? `<header id="resume-educations-section-header" class="${clsx(
                    'tw-mb-1.5 tw-text-3xl tw-font-bold tw-underline tw-underline-offset-8 print:tw-underline-offset-4',
                  )}">
                    Education
                  </header>`
                : ''
            }
            <a href="${url}" target="_blank">
              <header class="${clsx(
                'tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-px-3 tw-py-2',
              )}">
                <p class="${clsx(
                  'tw-text-2xl tw-font-medium tw-text-primary',
                )}">
                  ${institution}
                </p>
                <p class="${clsx(
                  'tw-text-base tw-font-medium tw-text-primary',
                )}">
                  ${date.formatDate(startDate)} - ${date.formatDate(endDate)}
                </p>
              </header>
              <p class="${clsx(
                'tw-p-2 tw-text-xl tw-font-regular tw-text-primary',
              )}">
                ${studyType} ${area}
              </p>
            </a>
          </li>`;
        })
        .join('\n')}
    </ul>
  </section>`;
}
