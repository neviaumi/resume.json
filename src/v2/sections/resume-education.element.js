import clsx from 'clsx';

import { date, styles } from '../helpers.js';

class ResumeEducationElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const educations = JSON.parse(this.attributes.educations.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section>
  <header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8')}">Education</header>
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
${educations
  .map(education => {
    const { area, endDate, institution, startDate, studyType, url } = education;
    return `<li class="${clsx('tw-border-b tw-border-gray-200 tw-py-2')}">
<a 
href="${url}" 
target="_blank"
 >
<header class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-px-3 tw-py-2')}">

<p class="${clsx('tw-text-2xl tw-font-semibold')}">${institution}</p>
<p class="${clsx('tw-font-medium')}">${date.formatDate(startDate)} - ${date.formatDate(endDate)}</p>
</header>
<p class="${clsx('tw-p-2 tw-text-xl tw-font-medium tw-text-primary')}">${studyType} ${area}</p>

</a>

</li>`;
  })
  .join('\n')}</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('resume-education', ResumeEducationElement);
