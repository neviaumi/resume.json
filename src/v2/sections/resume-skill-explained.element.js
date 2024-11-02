import './skill-badge.element.js';

import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeSkillExplainedElement extends styles.withInjectedStyles(
  HTMLElement,
)({
  mode: 'open',
}) {
  constructor() {
    super();
  }

  connectedCallback() {
    const githubLink = JSON.parse(this.attributes['github-link'].value);
    const readmeLink = new URL(
      `${githubLink}/resume.json?tab=readme-ov-file#skill-level-definitions`,
    );
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('tw-mb-3')}">
<p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-1')}">
    <skill-badge skill="Skill" level="Master" element="span"></skill-badge>
    Means I have mastered this skill.
</p>
<p class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-1')}">
    <skill-badge skill="Skill" level="Intermediate" element="span"></skill-badge>
    Means I am at an intermediate level in this skill.
</p>
<a href="${readmeLink}" target="_blank" class="${clsx('tw-underline')}">Check the README for a detailed definition of 'mastered' and 'intermediate.'</a>

</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-skill-explained', ResumeSkillExplainedElement);
