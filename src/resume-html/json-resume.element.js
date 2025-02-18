import './sections/resume-header.element.js';
import './sections/resume-about.element.js';
import './sections/resume-skills.element.js';
import './sections/resume-skill-explained.element.js';
import './sections/resume-summary.element.js';
import './sections/resume-experiences.element.js';
import './sections/resume-references.element.js';
import './sections/resume-projects.element.js';
import './sections/resume-education.element.js';

import clsx from 'clsx';

import { json, styles } from './helpers.js';

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
                <resume-header data='${json.withQuoteEscape(JSON.stringify)(resume.basics)}'></resume-header>

                <section class="${clsx('tw-grid tw-gap-2 md:tw-grid-cols-[16rem_minmax(0,1fr)] md:tw-gap-8 ')}">
                    <div class="${clsx('tw-flex tw-flex-col tw-gap-3')}">
                        <resume-about data='${json.withQuoteEscape(JSON.stringify)(resume.basics)}'></resume-about>
                        <resume-skill-explained
                                highlighted-skills='${json.withQuoteEscape(JSON.stringify)(highlightedSkills)}'
                                github-link='${json.withQuoteEscape(
                                  JSON.stringify,
                                )(
                                  (() => {
                                    const githubProfile =
                                      resume.basics.profiles.find(
                                        profile =>
                                          profile.network.toLowerCase() ===
                                          'github',
                                      );
                                    if (!githubProfile) return null;
                                    return githubProfile.url;
                                  })(),
                                )}'></resume-skill-explained>
                        <resume-skills skills='${json.withQuoteEscape(JSON.stringify)(resume.skills)}'
                                       languages='${json.withQuoteEscape(JSON.stringify)(resume.languages)}'
                                       highlighted-skills='${json.withQuoteEscape(JSON.stringify)(highlightedSkills)}'
                        ></resume-skills>
                        
                    </div>
                    <div class="${clsx('tw-flex tw-flex-col tw-gap-3 md:tw-border-l md:tw-border-primary md:tw-pl-4')}">
                        <resume-summary
                            summary='${json.withQuoteEscape(JSON.stringify)(resume.basics.summary)}'></resume-summary>
                        <resume-experiences works='${json.withQuoteEscape(JSON.stringify)(resume.work)}'
                                            skills='${JSON.stringify(resume.skills)}'
                                            highlighted-skills='${json.withQuoteEscape(JSON.stringify)(highlightedSkills)}'
                        ></resume-experiences>
                        <resume-references references='${json.withQuoteEscape(JSON.stringify)(resume.references)}'
                                           linkedin-link="${linkedInLink}"></resume-references>
                        <resume-projects projects='${json.withQuoteEscape(JSON.stringify)(resume.projects)}'
                                         skills='${json.withQuoteEscape(JSON.stringify)(resume.skills)}'
                                         highlighted-skills='${json.withQuoteEscape(JSON.stringify)(highlightedSkills)}'
                        ></resume-projects>
                        <resume-education
                            educations='${json.withQuoteEscape(JSON.stringify)(resume.education)}'></resume-education>
                    </div>
                </section>
            </main>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('json-resume', JsonResumeElement);
