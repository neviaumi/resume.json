import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-application-element" class="container-fluid">
<div class="row">
<section class="col-5">
    <h1 class="text-decoration-underline" slot="about-company">About</h1>
    <p slot="company-summary"></p>
</section>
<section class="col-5">
    <h1 class="text-decoration-underline">Role expectation</h1>
    <p slot="role-expectation"></p>
</section>
</div>

</article>`;
export const elementName = 'resume-application';

class ResumeApplicationElement extends HTMLElement {
  data = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open', slotAssignment: 'named' });

    injectSharedStyles(this.shadowRoot);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupAboutApplicationCompany();
    this.#setupAboutApplicationRole();
  }

  #setupAboutApplicationCompany() {
    if (!this.data.company) return;
    this.shadowRoot.querySelector(
      "[slot='about-company']",
    ).innerText = `About ${this.data.company.name}`;
    this.shadowRoot.querySelector("[slot='company-summary']").innerText =
      this.data.company.summary;
  }

  #setupAboutApplicationRole() {
    if (!this.data.roleSummary) return;
    this.shadowRoot.querySelector("[slot='role-expectation']").innerText =
      this.data.roleSummary;
  }
}

customElements.define(elementName, ResumeApplicationElement);
