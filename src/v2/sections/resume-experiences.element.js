import './skill-badge.element.js';

import clsx from 'clsx';

import { date, skills as skillsHelper, styles } from '../helpers.js';

class ResumeExperiencesElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const works = JSON.parse(this.attributes.works.value).slice(0, 4);
    const skills = JSON.parse(this.attributes.skills.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section>
<h1 class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-semibold tw-underline tw-underline-offset-8')}">Experience</h1>
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
    ${works
      .map(work => {
        const {
            company,
            description,
            endDate,
            highlights,
            keywords,
            position,
            startDate,
            summary,
            website,
          } = work,
          categorizedKeywords = skillsHelper.categorizeKeywordsBySkillLevel(
            keywords,
            skills,
          );

        return `<li class="${clsx('tw-border-b tw-border-primary')}">
<header>
<a 
    class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-bg-emerald-500 tw-px-3 tw-py-2  tw-text-white')}" 
    href="${website}" 
    target="_blank">
<p class="${clsx('tw-text-2xl tw-font-semibold')}">${position} in ${company}</p>
<p class="${clsx('tw-font-medium')}">${date.formatDate(startDate)} - ${endDate ? date.formatDate(endDate) : 'Present'}</p>
</a>
</header>
<section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
<p class="tw-text-primary tw-text-xl tw-font-medium">${description}</p>
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
<p>${summary}</p>
<ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
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
