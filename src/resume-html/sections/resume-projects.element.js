import clsx from 'clsx';

import { skills as skillsHelper, styles } from '../helpers.js';

class ResumeProjectsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const projects = JSON.parse(this.attributes.projects.value).slice(0, 3),
      skills = JSON.parse(this.attributes.skills.value),
      highlightedSkills = JSON.parse(
        this.attributes['highlighted-skills'].value,
      );
    const template = document.createElement('template');
    template.innerHTML = `
<section aria-labelledby="resume-projects-section-header">
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
${projects
  .map((project, index) => {
    const { description, highlights, keywords, name, url } = project,
      categorizedKeywords = skillsHelper.categorizeKeywordsBySkillLevel(
        keywords,
        skills,
      );
    // language=html
    return `<li class="${clsx('tw-border-b tw-border-primary print:tw-break-inside-avoid')}" title="${name}">
${index === 0 ? `<header id="resume-projects-section-header" class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black tw-underline tw-underline-offset-8 print:tw-underline-offset-4')}">Open Source Projects</header>` : ''}

<header>
    <a     
        class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2')}" 
        href="${url}"
    >
        <p class="${clsx('tw-text-2xl tw-font-black')}">${name}</p>
        <p class="${clsx('tw-text-base tw-font-medium')}">${url}</p>
    </a>
</header>
<section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">

<p class="${clsx('tw-text-xl tw-font-bold tw-text-primary')}">${description}</p>
<ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">
${[
  [
    'Highlight',
    keywords
      .filter(skillsHelper.includeHighlightedSkills(highlightedSkills))
      .sort(),
  ],
  [
    'Master',
    (categorizedKeywords.Master ?? []).filter(
      skillsHelper.excludeHighlightedSkills(highlightedSkills),
    ),
  ],
  [
    'Intermediate',
    (categorizedKeywords.Intermediate ?? []).filter(
      skillsHelper.excludeHighlightedSkills(highlightedSkills),
    ),
  ],
  [
    'Unknown',
    (categorizedKeywords.Unknown ?? []).filter(
      skillsHelper.excludeHighlightedSkills(highlightedSkills),
    ),
  ],
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
${highlights.map(highlight => `<li class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${highlight}</li>`).join('')}
</ul>
</li>`;
  })
  .join('\n')}
</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-projects', ResumeProjectsElement);
