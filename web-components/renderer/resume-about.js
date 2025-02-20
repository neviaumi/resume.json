import clsx from 'clsx';

import { baseUrl } from '../helpers.js';
import githubIcon from '../icons/github-mark.svg';
import homeIcon from '../icons/home.svg';
import linkedInIcon from '../icons/LI-In-Bug.png';

function countryCodeToFlag(countryIso2Code) {
  return { HK: '🇭🇰', UK: '🇬🇧' }[countryIso2Code] ?? '🇬🇧';
}

export function renderAboutSection({
  countryCode,
  name,
  profiles,
  region,
  website,
}) {
  const profilesLength = profiles.length;
  return `
  <section class="${clsx('print:tw-break-inside-avoid')}">
    <header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">About</header>
    <div class="${clsx('tw-px-1')}">
      <p class="${clsx('tw-mb-1 tw-flex tw-content-center tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}">
        <span class="${clsx('tw-text-lg')}">${countryCodeToFlag(countryCode)}</span>
        <span>${region}</span>
      </p>
      <a href="${website}" target="_blank" class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}">
        <img src="${homeIcon}" alt="home icon" class="${clsx('tw-h-2.5')}"/>
        About me
      </a>

      ${profiles
        .map((profile, index) => {
          const isLastItem = index === profilesLength - 1;
          const network = profile.network.toLowerCase();
          const icon =
            network === 'github'
              ? githubIcon
              : new URL(linkedInIcon, baseUrl).toString();
          return `<a title="${name} ${profile.network}" href="${profile.url}" target="_blank" class='${clsx(
            'tw-text-base tw-font-medium tw-text-primary',
            'tw-items-center',
            'tw-flex',
            'tw-gap-2',
            isLastItem ? '' : 'tw-mb-1',
          )}'>
          <img src="${icon}" alt="${profile.network}" class="${clsx('tw-h-2.5')}"/>
          ${profile.username}
        </a>`;
        })
        .join('\n')}
    </div>
  </section>`;
}
