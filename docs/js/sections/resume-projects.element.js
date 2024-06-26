import { groupByKeyword, sortSkills } from '../skills.helper.js';
import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-projects-element">
<h1 class="text-decoration-underline">Open Source Projects</h1>
<ul class="list-group list-group-flush d-print-block" slot="projects"/>
</article>`;

export const elementName = 'resume-projects';
class ResumeProjectsElement extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupProjects();
  }

  #setupProjects() {
    if (!this.data?.projects.length > 0) return;
    const { projects } = this.data;
    this.shadowRoot.querySelector("[slot='projects']").innerHTML = projects
      .map(project => {
        const { description, highlights, keywords, name, url } = project;
        return `<li class="list-group-item card d-print-block border-light">
<div class="card-body">
<h2 class="card-title">
    <a href="${url}" target="_blank" class="text-decoration-none text-reset d-flex align-items-center">
        ${name} <span class="ms-3 fs-4 text-secondary">${url}</span>
    </a>
</h2>
<h3 class="card-subtitle text-secondary mb-2">${description}</h3>
${this.#skills(keywords)}
<ul class="card-text">
    ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
</ul>
</div>
</li>`;
      })
      .join('');
  }

  #skills(keywords) {
    const { skillWanted } = this.data;
    const shouldHighlightSkill = skillWanted.length > 0;
    const isSkillWanted = skill => skillWanted.includes(skill);

    return `<ul class="list-unstyled mb-2 d-flex gap-1 flex-wrap">${sortSkills(
      groupByKeyword(this.data.skills ?? [], keywords),
    )
      .toSorted(([keywordA], [keywordB]) => {
        if (!shouldHighlightSkill) return 0;
        if (isSkillWanted(keywordA) && isSkillWanted(keywordB)) return 0;
        return isSkillWanted(keywordA) ? -1 : 1;
      })
      .map(([keyword, level]) => {
        if (shouldHighlightSkill) {
          return `<li class="badge ${
            skillWanted.includes(keyword) ? 'bg-primary' : 'bg-light text-dark'
          }">${keyword}</li>`;
        }
        const isClassified = level !== 'Unknown';
        if (!isClassified)
          return `<li class="badge bg-light text-dark">${keyword}</li>`;
        return `<li class="badge ${
          level === 'Master' ? 'bg-primary' : 'bg-secondary'
        }">${keyword}</li>`;
      })
      .join('')}</ul>`;
  }
}

customElements.define(elementName, ResumeProjectsElement);
