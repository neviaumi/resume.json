import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article class="ms-3" data-testid="resume-about-element">
<h1>About</h1>
<p class="d-flex gap-4 mb-3 align-items-center" slot="location"/>
<p slot="birthday"/>
<p class="d-flex gap-4 mb-3 align-items-center" slot="website"/>
<ul class="list-unstyled d-flex flex-column gap-3 mt-3" slot="profiles"/>
</article>`;

export const elementName = 'resume-about';

function countryCodeToFlag(countryIso2Code) {
  return { HK: '🇭🇰', UK: '🇬🇧' }[countryIso2Code] ?? '🇬🇧';
}

class ResumeAboutElement extends HTMLElement {
  data = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    injectSharedStyles(this.shadowRoot);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupLocation();
    this.#setupBirthday();
    this.#setupWebSite();
    this.#setupProfiles();
  }

  #setupLocation() {
    if (!this.data.location) return;
    this.shadowRoot.querySelector(
      "[slot='location']",
    ).innerHTML = `<span>${countryCodeToFlag(
      this.data.location.countryCode,
    )}</span><span>${this.data.location.region}</span>`;
  }

  #setupBirthday() {
    const slot = this.shadowRoot.querySelector("[slot='birthday']");
    if (!this.data.birthday) {
      slot.className = 'd-none';
      return;
    }
    slot.className = 'd-flex gap-4 mb-3 align-items-center';
    slot.innerHTML = `<span class="bi bi-balloon"></span>
<span>Born in ${new Date(this.data.birthday).getFullYear()}</span>`;
  }

  #setupWebSite() {
    if (!this.data.website) return;
    const websitePath = new URL(this.data.website);
    this.shadowRoot.querySelector(
      "[slot='website']",
    ).innerHTML = `<span class="bi bi-house"></span>
<a href="${this.data.website}" target="_blank" class="text-reset text-decoration-none">${websitePath.pathname}</a>`;
  }

  #setupProfiles() {
    if (!this.data.profiles || this.data.profiles.length === 0) return;
    this.shadowRoot.querySelector("[slot='profiles']").innerHTML =
      this.data.profiles
        .map(
          profile =>
            `<li>
<span class="bi bi-${profile.network.toLowerCase()} me-3"></span>
<a href="${profile.url}" target="_blank" 
class="text-reset text-decoration-none">${profile.username}</a>
</li>`,
        )
        .join('');
  }
}

customElements.define(elementName, ResumeAboutElement);
