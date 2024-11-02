import './skill-badge.element.js';

import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeSkillsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const skills = Object.entries(
      JSON.parse(this.attributes.skills.value).reduce(
        (acc, { keywords, level, name }) => {
          acc[name] = {
            ...(acc[name] || {}),
            [level]: keywords,
          };
          return acc;
        },
        {},
      ),
    );
    const languages = JSON.parse(this.attributes.languages.value);
    const template = document.createElement('template');
    template.innerHTML = `
<article>
${skills
  .map(([name, levels]) => {
    return `<section class="${clsx('tw-mb-2 tw-border-b tw-border-primary')}">
<header class="${clsx('tw-mb-1.5 tw-text-2xl tw-font-bold')}">${name}</header>
${[
  ['Master', levels.Master],
  ['Intermediate', levels.Intermediate],
]
  .map(([level, skillsOnLevel]) => {
    if (!skillsOnLevel || skillsOnLevel.length < 1) return '';
    return `<h2 class="${clsx('tw-mb-0.5 tw-font-semibold', level === 'Master' ? 'tw-text-primary' : 'tw-text-secondary')}">${level}</h2>
<ul class="${clsx('tw-mb-1 tw-flex tw-w-32 tw-flex-wrap tw-gap-1 tw-px-1')}">${skillsOnLevel
      .map(
        skill =>
          `<skill-badge skill="${skill}" level="${level}" element="li"></skill-badge>`,
      )
      .join('')}</ul>
`;
  })
  .join('\n')}
</section>`;
  })
  .join('\n')}
<section class="${clsx('tw-border-b tw-border-primary')}">
<header class="${clsx('tw-mb-1.5 tw-text-2xl tw-font-bold')}">Languages</header>
<ul class="${clsx('tw-mb-1 tw-flex tw-gap-1 tw-px-1')}">
${languages
  .map(
    language =>
      `<skill-badge skill="${language.language}" level="${language.fluency}" element="li"></skill-badge>`,
  )
  .join('')}</ul>
</section>
</article>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-skills', ResumeSkillsElement);
