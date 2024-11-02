import clsx from 'clsx';

import { skills as skillsHelper, styles } from '../helpers.js';

class ResumeProjectsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const projects = JSON.parse(this.attributes.projects.value),
      skills = JSON.parse(this.attributes.skills.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section>
<h1 class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8')}">Open Source Projects</h1>
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
${projects
  .map(project => {
    const { description, highlights, keywords, name, url } = project,
      categorizedKeywords = skillsHelper.categorizeKeywordsBySkillLevel(
        keywords,
        skills,
      );
    // language=html
    return `<li class="${clsx('tw-border-b tw-border-primary')}">
<header>
    <a     
        class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2')}" 
        href="${url}"
    >
        <p class="${clsx('tw-text-2xl tw-font-semibold')}">${name}</p>
        <p class="${clsx('tw-font-medium')}">${url}</p>
    </a>
</header>
<section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">

<p class="tw-text-primary tw-text-xl tw-font-medium">${description}</p>
<ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">
${[
  ['Master', categorizedKeywords.Master ?? []],
  ['Intermediate', categorizedKeywords.Intermediate ?? []],
  ['Unknown', categorizedKeywords.Unknown ?? []],
]
  .map(([level, keywords]) => {
    return keywords.map(
      keyword =>
        `<skill-badge skill="${keyword}" level="${level}" element="ls"></skill-badge>`,
    );
  })
  .flat()
  .join('\n')}
</ul>
<ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
</ul>
</li>`;
  })
  .join('\n')}
</ul>
</section>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-projects', ResumeProjectsElement);
