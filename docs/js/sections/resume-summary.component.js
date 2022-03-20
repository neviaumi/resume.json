import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article>
<h1 class="text-decoration-underline">Summary</h1>
<p class="list-unstyled" slot="summary"/>
</article>`;

export const elementName = 'resume-summary';
class ResumeSummaryComponent extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupSummary();
  }

  #setupSummary() {
    if (!this.data) return;
    this.shadowRoot.querySelector("[slot='summary']").innerHTML = this.data;
  }
}

customElements.define(elementName, ResumeSummaryComponent);
