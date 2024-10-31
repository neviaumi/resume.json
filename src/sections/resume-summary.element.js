import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-summary-element">
<h1 class="text-decoration-underline">Summary</h1>
<p slot="summary"></p>
</article>`;

export const elementName = 'resume-summary';
class ResumeSummaryElement extends HTMLElement {
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
    this.shadowRoot.querySelector("[slot='summary']").innerText = this.data;
  }
}

customElements.define(elementName, ResumeSummaryElement);
