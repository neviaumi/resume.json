import { injectSharedStyles } from './styles.js';

export const elementName = 'resume-header';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    header, img {
      height: 12rem;
    }
  </style>
<header data-testid="resume-header-element" class="d-flex align-items-center justify-content-between px-5 pt-3 mb-3 border-top border-3 border-primary">
    <div>
        <h1 slot="name"></h1>
        <h2 class="text-muted" slot="label"></h2>
        <p class="d-flex gap-3 mb-1" slot="phone"/>
        <p class="d-flex gap-3 mb-2" slot="email"/>
        <p class="d-flex gap-3 d-print-none mb-0">
            <span class="bi bi-printer"></span>
            <a href="resume.pdf" target="_blank" class="text-reset text-decoration-none">
                <span>PDF version</span>
            </a>
        </p>
    </div>
    <img class="img-thumbnail rounded-circle h-100 border-primary" slot="profile-img"/>
</header>`;

class HeaderElement extends HTMLElement {
  data = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.attributes.data) return;
    this.data = JSON.parse(this.attributes.data.value);
    this.shadowRoot.querySelector('[slot="name"]').innerHTML = this.data.name;
    this.shadowRoot
      .querySelector('[slot="profile-img"]')
      .setAttribute('src', this.data.picture);
    this.shadowRoot.querySelector('[slot="label"]').innerHTML = this.data.label;
    this.#setupEmail();
    this.#setupPhone();
  }

  #setupPhone() {
    if (!this.data.phone) return;
    this.shadowRoot.querySelector("[slot='phone']").innerHTML =
      `<span class="bi bi-telephone-outbound"></span>
<a href="tel:+44${this.data.phone.replaceAll(
        ' ',
        '',
      )}" class="text-reset text-decoration-none">+44 ${this.data.phone}</a>`;
  }

  #setupEmail() {
    if (!this.data.email) return;
    this.shadowRoot.querySelector("[slot='email']").innerHTML =
      `<span class="bi bi-envelope"></span>
<a href="mailto:${this.data.email}?subject=${encodeURIComponent(
        'Job opportunity',
      )}" class="text-reset text-decoration-none">${this.data.email}</a>`;
  }
}

customElements.define(elementName, HeaderElement);
