import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeSummaryElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const summary = JSON.parse(this.attributes.summary.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section>
  <header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8')}">Summary</header>
  <p class="${clsx('tw-text-base')}">${summary}</p>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-summary', ResumeSummaryElement);
