import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-application-element" class="container-fluid">
<div class="row">
<section class="col-5">
    <h1 class="text-decoration-underline" slot="about-company">About</h1>
    <p slot="company-summary"></p>
</section>
<section class="col-5" id="expectation">
    <h1 id="salary-expectation-heading" class="text-decoration-underline">Salary expectation</h1>
    <p slot="salary-expectation" aria-labelledby="salary-expectation-heading"></p>
    <h1 id="role-expectation-heading" class="text-decoration-underline">Role expectation</h1>
    <ul slot="role-expectation" aria-labelledby="role-expectation-heading"></ul>
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
    this.#setupAboutApplicationSalary();
  }

  #setupAboutApplicationSalary() {
    if (!this.data.salary) return;
    const { currency, expectation, type } = this.data.salary;
    this.shadowRoot.querySelector("[slot='salary-expectation']").innerText =
      `${new Intl.NumberFormat('en-GB', {
        currency: currency,
        maximumFractionDigits: 0,
        style: 'currency',
      }).format(expectation)} ${type}`;
  }

  #setupAboutApplicationCompany() {
    if (!this.data.company) return;
    this.shadowRoot.querySelector("[slot='about-company']").innerText =
      `About ${this.data.company.name}`;
    this.shadowRoot.querySelector("[slot='company-summary']").innerText =
      this.data.company.summary;
  }

  #setupAboutApplicationRole() {
    if (
      !this.data.role ||
      !this.data.role.responsibilities ||
      this.data.role.responsibilities.length === 0
    ) {
      this.shadowRoot
        .querySelector('#expectation')
        .removeChild(
          this.shadowRoot.querySelector('#role-expectation-heading'),
        );
      return;
    }
    this.shadowRoot.querySelector("[slot='role-expectation']").innerHTML =
      this.data.role.responsibilities
        .slice(0, 4)
        .map(responsibility => {
          return `<li >${responsibility}</li>`;
        })
        .join('');
  }
}

customElements.define(elementName, ResumeApplicationElement);
