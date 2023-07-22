import { elementName as headerElementName } from './header.element.js';
import { elementName as resumeAboutElementName } from './sections/resume-about.element.js';
import { elementName as resumeApplicationElementName } from './sections/resume-application.element.js';
import { elementName as resumeEducationElementName } from './sections/resume-education.element.js';
import { elementName as resumeLanguagesElementName } from './sections/resume-language.element.js';
import { elementName as resumeProjectsElementName } from './sections/resume-projects.element.js';
import { elementName as resumeReferencesElementName } from './sections/resume-references.element.js';
import { elementName as resumeSkillsElementName } from './sections/resume-skills.element.js';
import { elementName as resumeSummaryElementName } from './sections/resume-summary.element.js';
import { elementName as resumeWorkElementName } from './sections/resume-work.element.js';
import { injectSharedStyles } from './styles.js';

const template = document.createElement('template');
template.innerHTML = `
<style>

    @media print {
      .page-content.border {
        border: 0;!important
      }
      .page-content.shadow {
        box-shadow: none;!important
      }
    }
    @media screen {
      .page {
        display: flex;
        justify-content: center;
       }
      .page-content {
        width: 210mm;
        padding: 0 0.8rem; /* bootstrap unable remove class name when media is print*/
        border: 1px solid #000;
        box-shadow: 0 .5rem 1rem rgba(0,0,0, 0.15);
      }
    }
</style>
<main class="page">
    <section class="page-content">
        <slot name="${headerElementName}"></slot>
        <main class="container-fluid">
            <div class="row gx-1">
                <aside class="col-3 d-none d-sm-block">
                    <slot name="${resumeAboutElementName}"></slot>
                    <slot name="${resumeSkillsElementName}"></slot>
                    <slot name="${resumeLanguagesElementName}"></slot>
                </aside>
                <section class="col">
                    <slot name="${resumeSummaryElementName}"></slot>
                    <slot name="${resumeApplicationElementName}"></slot>
                    <slot name="${resumeWorkElementName}"></slot>
                    <slot name="${resumeReferencesElementName}"></slot>
                    <slot name="${resumeProjectsElementName}"></slot>
                    <slot name="${resumeEducationElementName}"></slot>
                </section>
            </div>
        </main>
    </section>
</main>`;

export const elementName = 'json-resume';

class JsonResumeElement extends HTMLElement {
  resume = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['resume'];
  }

  connectedCallback() {
    if (!this.attributes.resume?.value) return;
    this.#initializeChildren(this.attributes.resume.value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'resume' && !!newValue) {
      this.#initializeChildren(JSON.parse(newValue));
    }
  }

  #initializeChildren(resume) {
    this.resume = resume;
    this.#setupHeader();
    this.#setupAboutSection();
    this.#setupSkillsSection();
    this.#setupSummarySection();
    this.#setupApplicationSection();
    this.#setupWorkSection();
    this.#setupReferenceSection();
    this.#setupProjectsSection();
    this.#setupEducationSection();
    this.#setupLanguageSection();
  }

  #setupApplicationSection() {
    if (!this.resume.meta?.application) return;
    const element = document.createElement(resumeApplicationElementName);
    element.setAttribute('data', JSON.stringify(this.resume.meta.application));
    this.shadowRoot
      .querySelector(`slot[name="${resumeApplicationElementName}"]`)
      .replaceChildren(element);
  }

  #setupHeader() {
    if (!this.resume.basics) return;
    const element = document.createElement(headerElementName);
    element.setAttribute('data', JSON.stringify(this.resume.basics));

    this.shadowRoot
      .querySelector(`slot[name="${headerElementName}"]`)
      .replaceChildren(element);
  }

  #setupAboutSection() {
    if (!this.resume.basics) return;
    const element = document.createElement(resumeAboutElementName);
    element.setAttribute('data', JSON.stringify(this.resume.basics));

    this.shadowRoot
      .querySelector(`slot[name="${resumeAboutElementName}"]`)
      .replaceChildren(element);
  }

  #setupWorkSection() {
    if (!this.resume.work) return;
    const skills = this.resume.skills || [];
    const skillWanted = this.resume.meta.application?.role?.skillWanted ?? [];

    const element = document.createElement(resumeWorkElementName);
    element.setAttribute(
      'data',
      JSON.stringify({ skillWanted, skills, work: this.resume.work }),
    );

    this.shadowRoot
      .querySelector(`slot[name="${resumeWorkElementName}"]`)
      .replaceChildren(element);
  }

  #setupSkillsSection() {
    if (!this.resume.skills) return;
    const skills = this.resume.skills;
    const skillWanted = this.resume.meta.application?.role?.skillWanted ?? [];
    const element = document.createElement(resumeSkillsElementName);
    element.setAttribute(
      'data',
      JSON.stringify({
        skillWanted,
        skills,
      }),
    );

    this.shadowRoot
      .querySelector(`slot[name="${resumeSkillsElementName}"]`)
      .replaceChildren(element);
  }

  #setupLanguageSection() {
    if (!this.resume.languages) return;
    const skillWanted = this.resume.meta.application?.role?.skillWanted ?? [];
    const languages = this.resume.languages;
    const element = document.createElement(resumeLanguagesElementName);
    element.setAttribute(
      'data',
      JSON.stringify({
        languages,
        skillWanted,
      }),
    );

    this.shadowRoot
      .querySelector(`slot[name="${resumeLanguagesElementName}"]`)
      .replaceChildren(element);
  }

  #setupSummarySection() {
    if (!this.resume.basics?.summary) return;
    const element = document.createElement(resumeSummaryElementName);
    element.setAttribute('data', JSON.stringify(this.resume.basics.summary));

    this.shadowRoot
      .querySelector(`slot[name="${resumeSummaryElementName}"]`)
      .replaceChildren(element);
  }

  #setupProjectsSection() {
    if (!this.resume.projects) return;
    const skillWanted = this.resume.meta.application?.role?.skillWanted ?? [];
    const skills = this.resume.skills || [];
    const element = document.createElement(resumeProjectsElementName);
    element.setAttribute(
      'data',
      JSON.stringify({ projects: this.resume.projects, skillWanted, skills }),
    );

    this.shadowRoot
      .querySelector(`slot[name="${resumeProjectsElementName}"]`)
      .replaceChildren(element);
  }

  #setupReferenceSection() {
    if (!this.resume.references) return;
    const element = document.createElement(resumeReferencesElementName);
    element.setAttribute('data', JSON.stringify(this.resume.references));

    this.shadowRoot
      .querySelector(`slot[name="${resumeReferencesElementName}"]`)
      .replaceChildren(element);
  }

  #setupEducationSection() {
    if (!this.resume.education) return;
    const element = document.createElement(resumeEducationElementName);
    element.setAttribute('data', JSON.stringify(this.resume.education));

    this.shadowRoot
      .querySelector(`slot[name="${resumeEducationElementName}"]`)
      .replaceChildren(element);
  }
}

customElements.define(elementName, JsonResumeElement);
