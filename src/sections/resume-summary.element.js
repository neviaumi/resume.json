import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeSummaryElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const summary = JSON.parse(this.attributes.summary.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
  <header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black tw-underline tw-underline-offset-8 print:tw-underline-offset-4')}">Summary</header>
  <p class="${clsx('tw-text-xl tw-font-medium tw-text-primary')}">${summary}</p>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-summary', ResumeSummaryElement);
