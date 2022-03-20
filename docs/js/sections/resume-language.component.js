import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article class="ms-3">
<h1 class="fs-2 ">Languages</h1>
<ul class="d-flex list-unstyled gap-1 flex-wrap" slot="languages"/>
</article>`;

export const elementName = 'resume-languages';
class ResumeEducationComponent extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.shadowRoot.querySelector("[slot='languages']").innerHTML = this.data
      .map(language => {
        const { fluency, language: languageName } = language;
        return `<li class="badge ${
          fluency === 'Master' ? 'bg-primary' : 'bg-secondary'
        }">${languageName}</li>`;
      })
      .join('');
  }
}

customElements.define(elementName, ResumeEducationComponent);
