import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article data-testid="resume-skills-element">
<ul class="list-group list-group-flush d-print-block" slot="skills"/>
</article>`;

export const elementName = 'resume-skills';

class ResumeSkillsElement extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    injectSharedStyles(this.shadowRoot);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupSkills();
  }

  #setupSkills() {
    const { skillWanted } = this.data;
    if (!this.data.skills.length > 0) return;
    const skills = Object.entries(
      this.data.skills.reduce((acc, { keywords, level, name }) => {
        acc[name] = {
          ...(acc[name] || {}),
          [level]: keywords,
        };
        return acc;
      }, {}),
    );
    const shouldHighlightSkill = skillWanted.length > 0;
    const highlightSkillIfWanted = skill =>
      skillWanted.includes(skill) ? 'bg-primary' : 'bg-light text-dark';
    this.shadowRoot.querySelector("[slot='skills']").innerHTML = skills
      .map(([name, levels]) => {
        const masterSkills = levels.Master ?? [];
        const intermediateSkills = levels.Intermediate ?? [];

        const skillLevels = [];
        if (masterSkills.length > 0) {
          skillLevels.push(`
            <h2 class="text-primary fs-3 text-nowrap">Master</h2>
            <ul class="list-unstyled d-flex gap-1 flex-wrap mb-2">${masterSkills
              .map(
                skill =>
                  `<li class="badge ${
                    shouldHighlightSkill
                      ? highlightSkillIfWanted(skill)
                      : 'bg-primary'
                  }">${skill}</li>`,
              )
              .join('')}</ul>
          `);
        }
        if (intermediateSkills.length > 0) {
          skillLevels.push(`
            <h2 class="text-secondary fs-3 text-nowrap">Intermediate</h2>
            <ul class="list-unstyled d-flex gap-1 flex-wrap">${intermediateSkills
              .map(
                skill =>
                  `<li class="badge ${
                    shouldHighlightSkill
                      ? highlightSkillIfWanted(skill)
                      : 'bg-secondary'
                  }">${skill}</li>`,
              )
              .join('')}</ul>
          `);
        }

        return `<li class="list-group-item d-print-block">
                <h1 class="card-title fs-2">${name}</h1>
                ${skillLevels.join('')}
</li>`;
      })
      .join('');
  }
}

customElements.define(elementName, ResumeSkillsElement);
