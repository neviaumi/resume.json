import './skill-badge.element.js';

import clsx from 'clsx';

import { date, skills as skillsHelper, styles } from '../helpers.js';

class ResumeExperiencesElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const works = JSON.parse(this.attributes.works.value).slice(0, 3);
    const skills = JSON.parse(this.attributes.skills.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section aria-labelledby="resume-experiences-section-header">
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
    ${works
      .map((work, index) => {
        const {
            company,
            description,
            endDate,
            highlights,
            keywords,
            location,
            position,
            startDate,
            summary,
            website,
          } = work,
          categorizedKeywords = skillsHelper.categorizeKeywordsBySkillLevel(
            keywords,
            skills,
          );

        return `<li class="${clsx('tw-border-b tw-border-primary print:tw-break-inside-avoid')}" title="${position} in ${company}">
${index === 0 ? `<header id="resume-experiences-section-header" class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8 print:tw-underline-offset-4')}">Experience</header>` : ''}

<header>
<a 
    class="${clsx('tw-flex tw-flex-col tw-rounded-xl tw-bg-emerald-500 tw-px-3 tw-py-2 tw-text-white')}" 
    href="${website}" 
    target="_blank">
    <span  class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between')}" >
    <p class="${clsx('tw-text-2xl tw-font-bold')}">${position} in ${company}</p>
<p class="${clsx('tw-text-base tw-font-semibold')}">${date.formatDate(startDate)} - ${endDate ? date.formatDate(endDate) : 'Present'}</p>
</span>
    <p class="${clsx('tw-text-base tw-font-medium')}">${location}</p>

</a>
</header>
<section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
<p class="${clsx('tw-text-xl tw-font-semibold tw-text-primary')}">${description}</p>
<ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">${[
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
<p class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${summary}</p>
<ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
${highlights.map(highlight => `<li class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${highlight}</li>`).join('')}
</ul>
</section>
</li>`;
      })
      .join('\n')}
</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-experiences', ResumeExperiencesElement);