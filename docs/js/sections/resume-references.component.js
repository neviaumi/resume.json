import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-references-element">
<h1 class="text-decoration-underline">References</h1>
<ul class="list-group list-group-flush d-print-block" slot="references"/>
</article>`;

export const elementName = 'resume-references';
class ResumeReferencesComponent extends HTMLElement {
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
    this.shadowRoot.querySelector("[slot='references']").innerHTML = this.data
      .map(reference => {
        const { name, reference: comment } = reference;
        return `<li class="list-group-item d-print-block">
<figure>
  <blockquote class="blockquote">
    <p>${comment}</p>
  </blockquote>
  <figcaption class="blockquote-footer text-end">
    ${name}
  </figcaption>
</figure>
</li>`;
      })
      .join('');
  }
}

customElements.define(elementName, ResumeReferencesComponent);
