import clsx from 'clsx';

import '../skill-badge.element.js';
import { skills as skillsHelper } from '../helpers.js';

export function renderProjectsSection({ highlightedSkills, projects, skills }) {
  // Limit projects to 3
  const limitedProjects = projects.slice(0, 3);

  return `
  <section aria-labelledby="resume-projects-section-header">
    <ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
      ${limitedProjects
        .map((project, index) => {
          const { description, highlights, keywords, name, url } = project;

          // Categorize keywords by skill levels
          const categorizedKeywords =
            skillsHelper.categorizeKeywordsBySkillLevel(keywords, skills);

          return `
          <li class="${clsx(
            'tw-border-b tw-border-primary print:tw-break-inside-avoid',
          )}" title="${name}" aria-describedby="project-${index}">
            ${
              index === 0
                ? `<header id="resume-projects-section-header" class="${clsx(
                    'tw-mb-1.5 tw-text-3xl tw-font-black tw-underline tw-underline-offset-8 print:tw-underline-offset-4',
                  )}">
                    Open Source Projects
                  </header>`
                : ''
            }
            <header>
              <a 
                class="${clsx(
                  'tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2',
                )}" href="${url}">
                <p class="${clsx('tw-text-2xl tw-font-black')}">${name}</p>
                <p class="${clsx('tw-text-base tw-font-medium')}">
                  ${new URL(url).protocol}//${new URL(url).hostname}${
                    new URL(url).pathname
                  }
                </p>
              </a>
            </header>
            <section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
              <p class="${clsx(
                'tw-text-xl tw-font-bold tw-text-primary',
              )}" id="project-${index}">
                ${description}
              </p>
              <ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">
                ${[
                  [
                    'Highlight',
                    keywords
                      .filter(
                        skillsHelper.includeHighlightedSkills(
                          highlightedSkills,
                        ),
                      )
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
                  .map(([level, keywordList]) => {
                    return keywordList
                      .map(
                        keyword =>
                          `<skill-badge skill="${keyword}" level="${level}" element="ls"></skill-badge>`,
                      )
                      .join('');
                  })
                  .join('\n')}
              </ul>
              <ul class="${clsx(
                'tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3',
              )}">
                ${highlights
                  .map(
                    highlight => `
                  <li class="${clsx(
                    'tw-text-base tw-font-medium tw-text-primary',
                  )}">
                    ${highlight}
                  </li>`,
                  )
                  .join('')}
              </ul>
            </section>
          </li>`;
        })
        .join('\n')}
    </ul>
  </section>`;
}
