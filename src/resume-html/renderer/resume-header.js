import clsx from 'clsx';

import { baseUrl } from '../helpers.js';
import envelopeIcon from '../icons/envelope.svg?url';
import wwwIcon from '../icons/globe-alt.svg?url';
import printerIcon from '../icons/printer.svg?url';

export function renderResumeHeader({ email, label, name, picture }) {
  return `
    <header class="${clsx('tw-mb-2 tw-flex tw-flex-wrap-reverse tw-justify-between tw-px-2 tw-pb-1 tw-pt-2')}">
      <div class="${clsx('tw-flex tw-flex-col tw-justify-between print:tw-break-inside-avoid')}">
        <div>
          <h1 class="${clsx('tw-text-5xl tw-font-black tw-text-primary')}">${name}</h1>
          <p class="${clsx('tw-text-3xl tw-font-regular tw-text-placeholder')}">${label}</p>
        </div>
        <div>
          <a href="mailto:${email}?subject=${encodeURIComponent(
            'Job opportunity',
          )}" class="${clsx('tw-flex tw-content-center tw-items-center tw-gap-2 tw-text-lg tw-font-medium tw-no-underline')}">
            <img class="${clsx('tw-h-3')}" src="${envelopeIcon}" alt="email-icon">
            ${email}
          </a>
          <a href="${new URL('resume.pdf', baseUrl).toString()}" target="_blank" class="${clsx('tw-flex tw-gap-2 tw-text-base tw-font-medium  tw-no-underline print:tw-hidden')}">
            <img class="${clsx('tw-h-3')}" src="${printerIcon}" alt="printer-icon">
            <span>PDF version</span>
          </a>
          <a href="https://neviaumi.github.io/resume.json/" target="_blank" class="${clsx('tw-hidden tw-content-center tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-no-underline print:tw-flex')}">
            <img class="${clsx('tw-h-3')}" src="${wwwIcon}" alt="www-icon">
            <span>Web version</span>
          </a>
        </div>
      </div>
      <img alt="picture" class="${clsx('tw-h-21 tw-rounded-full tw-border-2 tw-border-primary tw-p-0.5')}" src="${picture}"/>
    </header>`;
}
