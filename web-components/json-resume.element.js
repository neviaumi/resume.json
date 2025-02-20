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

function wrappingWithContainer(content) {
  return `<main
                class="${clsx('tw-container tw-mx-auto tw-rounded-md tw-border-t-4 tw-border-t-primary tw-bg-gray-50 tw-px-1 md:tw-px-4')}">
                ${content}
</main>`;
}

class JsonResumeElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  #renderAfterResumeLoaded(resume) {
    const highlightedSkills = resume.meta?.highlightedKeywords ?? [],
      linkedInLink = resume.basics.profiles.find(
        profile => profile.network.toLowerCase() === 'linkedin',
      )?.url;
    const template = document.createElement('template');
    // language=html
    template.innerHTML = wrappingWithContainer(`
                ${renderResumeHeader({ email: resume.basics.email, image: resume.basics.image, label: resume.basics.label, name: resume.basics.name, picture: resume.basics.picture })}
                <section class="${clsx('tw-grid tw-gap-2 md:tw-grid-cols-[16rem_minmax(0,1fr)] md:tw-gap-8 ')}">
                    <div class="${clsx('tw-flex tw-flex-col tw-gap-3')}">
                        ${renderAboutSection({
                          countryCode: resume.basics.location.countryCode,
                          name: resume.basics.name,
                          profiles: resume.basics.profiles,
                          region: resume.basics.location.region,
                          url: resume.basics.url,
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
                </section>`);
    this.shadowRoot.querySelector('main').remove();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  #renderAfterResumeLoadError(error) {
    const template = document.createElement('template');
    template.innerHTML = `
        <main
                class="${clsx('tw-container tw-mx-auto tw-rounded-md tw-border-t-4 tw-border-t-error tw-bg-gray-50 tw-px-1 md:tw-px-4')}">
                        <h1 class="tw-font-bold tw-text-xl tw-text-error-contrast">Error Loading Resume</h1>
                        <p>${error.message}</p>
                           <p class="tw-mt-2">Check if the given source <a href="${this.attributes.src.value}">${this.attributes.src.value}</a> is valid JSON and retry</p>

</main>
    `;
    this.shadowRoot.querySelector('main').remove();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const resumeJsonSource = this.attributes.src.value;
    const template = document.createElement('template');
    template.innerHTML = `${wrappingWithContainer(`
        <div class="tw-animate-pulse tw-h-screen tw-bg-gray-300 tw-my-2 tw-rounded-md"></div>
    `)}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    fetch(resumeJsonSource)
      .then(resp => resp.json())
      .then(resume => {
        this.#renderAfterResumeLoaded(resume);
      })
      .catch(error => {
        this.#renderAfterResumeLoadError(error);
      });
  }
}

customElements.define('json-resume', JsonResumeElement);
