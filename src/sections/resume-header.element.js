import clsx from 'clsx';

import { styles } from '../helpers.js';
import envelopeIcon from '../icons/envelope.svg?url';
import wwwIcon from '../icons/globe-alt.svg?url';
import printerIcon from '../icons/printer.svg?url';

class ResumeHeaderElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const resumeBasic = JSON.parse(this.attributes.data.value);
    const template = document.createElement('template');
    // language=html
    template.innerHTML = `
      <header class="${clsx('tw-mb-2 tw-flex tw-flex-wrap-reverse tw-justify-between tw-px-2 tw-pb-1 tw-pt-2')}">
        <div class="${clsx('tw-flex tw-flex-col tw-justify-between print:tw-break-inside-avoid')}">
          <div>
            <h1 class="${clsx('tw-text-5xl tw-font-black tw-text-primary')}">${resumeBasic.name}</h1>
            <p class="${clsx('tw-text-3xl tw-font-regular tw-text-placeholder')}">${resumeBasic.label}</p>
          </div>
          <div>
              <a href="mailto:${resumeBasic.email}?subject=${encodeURIComponent(
                'Job opportunity',
              )}" class="${clsx('tw-flex tw-content-center tw-items-center tw-gap-2 tw-text-lg tw-font-medium tw-no-underline')}">
                <img class="${clsx('tw-h-3')}" src="${envelopeIcon}" alt="email-icon">
                ${resumeBasic.email}
              </a>
              <a href="resume.pdf" target="_blank" class="${clsx('tw-flex tw-gap-2 tw-text-base tw-font-medium  tw-no-underline print:tw-hidden')}">
                <img class="${clsx('tw-h-3')}" src="${printerIcon}" alt="printer-icon">
                <span>PDF version</span>
              </a>
            <a href="${resumeBasic.website}" target="_blank" class="${clsx('tw-hidden tw-content-center tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-no-underline print:tw-flex')}">
              <img class="${clsx('tw-h-3')}" src="${wwwIcon}" alt="www-icon">
              <span>Web version</span>
            </a>
          </div>
        </div>
        <img alt="picture" class="${clsx('tw-h-21 tw-rounded-full tw-border-2 tw-border-primary tw-p-0.5')}" src="${resumeBasic.picture}"/>
      </header>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-header', ResumeHeaderElement);
