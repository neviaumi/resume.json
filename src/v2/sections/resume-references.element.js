import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeReferencesElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const references = JSON.parse(
        decodeURIComponent(this.attributes.references.value),
      ).slice(0, 4),
      linkedInLink = this.attributes['linkedin-link'].value;
    const template = document.createElement('template');
    template.innerHTML = `
<section>
  <header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8')}">References</header>
    <ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">${references
      .map(({ name, reference }) => {
        return `<li class="${clsx('tw-border-b tw-border-gray-200 tw-py-2')}">
<a href="${linkedInLink}" target="_blank" class="${clsx('tw-flex tw-flex-col tw-gap-1')}">
  <blockquote cite="${linkedInLink}">
    <p class="${clsx('tw-text-sm')}">${reference}</p>
  </blockquote>
  <p class="${clsx('tw-flex tw-justify-end tw-text-gray-600')}">
    ${name}
  </p>
</a>
</li>`;
      })
      .join('\n')}</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-references', ResumeReferencesElement);
