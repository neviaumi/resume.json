import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-application-element" class="container-fluid mb-4">
<div class="row" id="about-the-jobs">
    <section class="col-5" id="about-company">
        <h1 class="text-decoration-underline" slot="about-company">About</h1>
        <p slot="company-summary"></p>
    </section>
    <section class="col-5" id="expectation">
        <h1 id="role-expectation-heading" class="text-decoration-underline">Role expectation</h1>
        <ul slot="role-expectation" aria-labelledby="role-expectation-heading"></ul>
    </section>
</div>
<div class="row gap-2">
    <section class="col-10 d-flex flex-row gap-5 align-items-center">
        <h1 id="date-of-availability-heading" class="text-decoration-underline mb-0">Date of availability</h1>
        <p slot="date-of-availability" aria-labelledby="date-of-availability-heading" class="mb-0"></p>
    </section>
    <section class="col-10 d-flex flex-row gap-5 align-items-center">
        <h1 id="salary-expectation-heading" class="text-decoration-underline">Salary expectation</h1>
        <p slot="salary-expectation" class="mb-0" aria-labelledby="salary-expectation-heading"></p>
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
    this.#setupAboutApplicationDateOfAvailability();
  }

  #setupAboutApplicationDateOfAvailability() {
    const fourteenFiveDays = 1000 * 60 * 60 * 24 * 45;
    const dateObj = new Date(
      !this.data.available
        ? Date.now() + fourteenFiveDays
        : this.data.available,
    );
    this.shadowRoot.querySelector("[slot='date-of-availability']").innerText =
      dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
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
    const { name, summary } = this.data.company;
    if (!summary) {
      this.shadowRoot
        .querySelector('#about-the-jobs')
        .removeChild(this.shadowRoot.querySelector('#about-company'));
      this.shadowRoot
        .querySelector('#expectation')
        .setAttribute('class', 'col-10');
      return;
    }
    this.shadowRoot.querySelector("[slot='about-company']").innerText =
      `About ${name}`;
    this.shadowRoot.querySelector("[slot='company-summary']").innerText =
      summary;
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
