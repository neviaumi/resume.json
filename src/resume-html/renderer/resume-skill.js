import clsx from 'clsx';

import '../skill-badge.element.js';
import { skills as skillHelper } from '../helpers.js';

export function renderSkillsSection({
  highlightedSkills,
  languages,
  skills: skillsData,
}) {
  // Process the skills data into a grouped structure by level
  const skills = Object.entries(
    skillsData.reduce((acc, { keywords, level, name }) => {
      acc[name] = {
        ...(acc[name] || {}),
        [level]: keywords,
      };
      return acc;
    }, {}),
  );

  return `
  <article title="skills">
    ${skills
      .map(([name, levels]) => {
        return `
        <section class="${clsx(
          'tw-mb-2 tw-border-b tw-border-primary print:tw-break-inside-avoid',
        )}" title="${name}">
          <header class="${clsx('tw-mb-1 tw-text-2xl tw-font-black')}">${name}</header>
          ${[
            ['Master', levels.Master],
            ['Intermediate', levels.Intermediate],
          ]
            .map(([level, skillsOnLevel]) => {
              if (!skillsOnLevel || skillsOnLevel.length < 1) return '';
              return `
              <header class="${clsx(
                'tw-mb-0.5 tw-text-base tw-font-bold',
                level === 'Master' ? 'tw-text-primary' : 'tw-text-secondary',
              )}" title="${level}">${level}</header>
              <ul class="${clsx(
                'tw-mb-1 tw-flex tw-w-32 tw-flex-wrap tw-gap-1 tw-px-1',
              )}">
                ${skillsOnLevel
                  .toSorted(
                    skillHelper.highlightedSkillsFirst(highlightedSkills),
                  )
                  .map(skill => {
                    const skillShouldHighlighted =
                      skillHelper.includeHighlightedSkills(highlightedSkills)(
                        skill,
                      );
                    return `<skill-badge skill="${skill}" level="${
                      skillShouldHighlighted ? 'Highlight' : level
                    }" element="li"></skill-badge>`;
                  })
                  .join('')}
              </ul>
              `;
            })
            .join('\n')}
        </section>`;
      })
      .join('\n')}
    <section class="${clsx(
      'tw-border-b tw-border-primary print:tw-break-inside-avoid',
    )}" title="Languages">
      <header class="${clsx('tw-mb-1.5 tw-text-2xl tw-font-black')}">Languages</header>
      <ul class="${clsx('tw-mb-1 tw-flex tw-gap-1 tw-px-1')}">
        ${languages
          .map(
            language =>
              `<skill-badge skill="${language.language}" level="${language.fluency}" element="li"></skill-badge>`,
          )
          .join('')}
      </ul>
    </section>
  </article>`;
}
