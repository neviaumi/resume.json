import clsx from 'clsx';

import { styles } from './helpers.js';
import { renderAboutSection } from './renderer/resume-about.js';
import { renderEducationSection } from './renderer/resume-education.js';
import { renderExperiencesSection } from './renderer/resume-experiences.js';
import { renderResumeHeader } from './renderer/resume-header.js';
import { renderProjectsSection } from './renderer/resume-projects.js';
import { renderReferencesSection } from './renderer/resume-references.js';
import { renderSkillExplainedSection } from './renderer/resume-skill-explained.js';
import { renderSkillsSection } from './renderer/resume-skill.js';
import { renderSummarySection } from './renderer/resume-summary.js';

const shouldUseTailoredResume = import.meta.env.VITE_USE_TAILORED_RESUME;

const resume = await (async () => {
  const baseUrl = `${new URL(
    import.meta.env.BASE_URL,
    new URL(import.meta.url).origin,
  ).toString()}/`;
  if (shouldUseTailoredResume) {
    return fetch(new URL('resume.tailored.json', baseUrl));
  }
  return fetch(new URL('resume.base.json', baseUrl));
})().then(resp => resp.json());

class JsonResumeElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const highlightedSkills = resume.meta?.highlightedKeywords ?? [],
      linkedInLink = resume.basics.profiles.find(
        profile => profile.network.toLowerCase() === 'linkedin',
      )?.url;
    const template = document.createElement('template');
    // language=html
    template.innerHTML = `
            <main
                class="${clsx('tw-container tw-mx-auto  tw-rounded-md tw-border-t-4 tw-border-t-primary tw-bg-gray-50 tw-px-1 md:tw-px-4')}">
                ${renderResumeHeader({ email: resume.basics.email, label: resume.basics.label, name: resume.basics.name, picture: resume.basics.picture })}
                <section class="${clsx('tw-grid tw-gap-2 md:tw-grid-cols-[16rem_minmax(0,1fr)] md:tw-gap-8 ')}">
                    <div class="${clsx('tw-flex tw-flex-col tw-gap-3')}">
                        ${renderAboutSection({
                          birthday: resume.basics.birthday,
                          countryCode: resume.basics.location.countryCode,
                          name: resume.basics.name,
                          profiles: resume.basics.profiles,
                          region: resume.basics.location.region,
                          website: resume.basics.website,
                        })}
                        ${renderSkillExplainedSection({
                          githubLink: (() => {
                            const githubProfile = resume.basics.profiles.find(
                              profile =>
                                profile.network.toLowerCase() === 'github',
                            );
                            if (!githubProfile) return null;
                            return githubProfile.url;
                          })(),
                          highlightedSkills: highlightedSkills,
                        })}
                        ${renderSkillsSection({
                          highlightedSkills: highlightedSkills,
                          languages: resume.languages,
                          skills: resume.skills,
                        })}
                    </div>
                    <div class="${clsx('tw-flex tw-flex-col tw-gap-3 md:tw-border-l md:tw-border-primary md:tw-pl-4')}">
                        ${renderSummarySection({ summary: resume.basics.summary })}
                        ${renderExperiencesSection({
                          highlightedSkills: highlightedSkills,
                          skills: resume.skills,
                          works: resume.work,
                        })}
                        ${renderReferencesSection({
                          linkedInLink,
                          references: resume.references,
                        })}
                        ${renderProjectsSection({
                          highlightedSkills,
                          projects: resume.projects,
                          skills: resume.skills,
                        })}
                        ${renderEducationSection({
                          educations: resume.education,
                        })}
                    </div>
                </section>
            </main>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('json-resume', JsonResumeElement);
