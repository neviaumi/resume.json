import { formatDate } from '../date.helper.js';
import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article class="print-break-inside-avoid" data-testid="resume-education-element">
<h1 class="text-decoration-underline">Education</h1>
<ul class="list-group list-group-flush d-print-block" slot="education"/>
</article>`;

export const elementName = 'resume-education';
class ResumeEducationElement extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupReferences();
  }

  #setupReferences() {
    this.shadowRoot.querySelector("[slot='education']").innerHTML = this.data
      .map(education => {
        const { area, endDate, institution, startDate, studyType, url } =
          education;
        return `<li class="list-group-item d-print-block ">
<a href="${url}" class="text-decoration-none text-reset">
<h2 class="d-flex justify-content-between align-items-center">
    <span>${institution}</span>
    <span class="text-secondary fs-3">${formatDate(startDate)} - ${formatDate(
          endDate,
        )}</span>
</h2>
<h3 class="text-secondary">${studyType} ${area}</h3>
</a>

</li>`;
      })
      .join('');
  }
}

customElements.define(elementName, ResumeEducationElement);
