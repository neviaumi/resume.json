import clsx from 'clsx';

import '../skill-badge.element.js';
import { date, skills as skillsHelper } from '../helpers.js';

export function renderExperiencesSection({ highlightedSkills, skills, works }) {
  return `
  <section aria-labelledby="resume-experiences-section-header">
    <ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
      ${works
        .map((work, index) => {
          const {
            company,
            endDate,
            highlights,
            keywords,
            location,
            position,
            startDate,
            summary,
            url,
            website,
          } = work;

          const categorizedKeywords =
            skillsHelper.categorizeKeywordsBySkillLevel(
              keywords,
              skills,
              highlightedSkills,
            );

          const shouldRenderExperienceInDetail = index <= 3;
          const shouldRenderSectionHeader = index === 0;

          return `
          <li class="${clsx(
            'tw-border-b tw-border-primary print:tw-break-inside-avoid',
          )}" title="${position} in ${company}" aria-describedby="work-experience-${index}">
            ${
              shouldRenderSectionHeader
                ? `<header id="resume-experiences-section-header" class="${clsx(
                    'tw-mb-1.5 tw-text-3xl tw-font-black tw-underline tw-underline-offset-8 print:tw-underline-offset-4',
                  )}">
                    Experience
                  </header>`
                : ''
            }

            <header>
              <a 
                class="${clsx(
                  'tw-flex tw-flex-col tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2',
                )}" href="${url || website}" target="_blank">
                <span class="${clsx(
                  'tw-flex tw-flex-wrap tw-items-center tw-justify-between',
                )}">
                  <p class="${clsx('tw-text-2xl tw-font-black')}">
                    ${position} in ${company}
                  </p>
                  <p class="${clsx('tw-text-base tw-font-medium')}">
                    ${date.formatDate(startDate)} - ${
                      endDate ? date.formatDate(endDate) : 'Present'
                    }
                  </p>
                </span>
                <p class="${clsx('tw-text-base tw-font-medium')}">${location}</p>
              </a>
            </header>

            <section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
              ${
                shouldRenderExperienceInDetail && summary
                  ? `<p class="${clsx(
                      'tw-text-xl tw-font-bold tw-text-primary',
                    )}" id="work-experience-${index}">
                      ${summary}
                    </p>`
                  : ''
              }
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
                  .map(([level, keywords]) => {
                    return keywords
                      .map(
                        keyword =>
                          `<skill-badge skill="${keyword}" level="${level}" element="ls"></skill-badge>`,
                      )
                      .join('');
                  })
                  .flat()
                  .join('\n')}
              </ul>

              ${
                shouldRenderExperienceInDetail && highlights
                  ? `<ul class="${clsx(
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
                    </ul>`
                  : ''
              }
            </section>
          </li>`;
        })
        .join('\n')}
    </ul>
  </section>`;
}
