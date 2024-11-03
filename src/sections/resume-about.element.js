import clsx from 'clsx';

import { styles } from '../helpers.js';
import cakeIcon from '../icons/cake.svg';
import githubIcon from '../icons/github-mark.svg';
import homeIcon from '../icons/home.svg';
import linkedInIcon from '../icons/LI-In-Bug.png';

function countryCodeToFlag(countryIso2Code) {
  return { HK: '🇭🇰', UK: '🇬🇧' }[countryIso2Code] ?? '🇬🇧';
}

class ResumeAboutElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const resumeBasic = JSON.parse(this.attributes.data.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold')}">About</header>
<div class="${clsx('tw-px-1')}">
<p class="${clsx('tw-mb-1 tw-flex tw-content-center tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}" >
    <span class="${clsx('tw-text-lg')}">${countryCodeToFlag(resumeBasic.location.countryCode)}</span>
    <span>${resumeBasic.location.region}</span>
</p>
<p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}">
    <img src="${cakeIcon}" class="${clsx('tw-h-2.5')}" alt="birthday-icon"/>
    Born in ${new Date(resumeBasic.birthday).getFullYear()}
</p>
<a href="${resumeBasic.website}" target="_blank" class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}">
    <img src="${homeIcon}" alt="home icon" class="${clsx('tw-h-2.5')}"/>
    Home Page
</a>

${resumeBasic.profiles
  .map(profile => {
    const network = profile.network.toLowerCase();
    const icon = network === 'github' ? githubIcon : linkedInIcon;
    return `<a href="${profile.url}" target="_blank" class='${clsx('tw-text-base tw-font-medium tw-text-primary', 'tw-items-center', 'tw-flex', 'tw-gap-2', network === 'github' ? 'tw-mb-1' : '')}'>
        <img src="${icon}" alt="home icon" class="${clsx('tw-h-2.5')}"/>
        ${profile.username}
      </a>`;
  })
  .join('\n')}

</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-about', ResumeAboutElement);
