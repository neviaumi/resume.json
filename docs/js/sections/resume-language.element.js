import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article class="ms-3" data-testid="resume-language-element">
<h1 class="fs-2 ">Languages</h1>
<ul class="d-flex list-unstyled gap-1 flex-wrap" slot="languages"/>
</article>`;

const highlightLanguageByFluency = ({ fluency }) =>
  fluency === 'Master' ? 'bg-primary' : 'bg-secondary';

export const elementName = 'resume-languages';
class ResumeEducationComponent extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    const { languages, skillWanted } = this.data;
    const shouldHighlightSkill = skillWanted.length > 0;
    const highlightSkillIfWanted = ({ language }) =>
      skillWanted.includes(language) ? 'bg-primary' : 'bg-light text-dark';

    this.shadowRoot.querySelector("[slot='languages']").innerHTML = languages
      .map(language => {
        const { language: languageName } = language;
        return `<li class="badge ${
          shouldHighlightSkill
            ? highlightSkillIfWanted(language)
            : highlightLanguageByFluency(language)
        }">${languageName}</li>`;
      })
      .join('');
  }
}

customElements.define(elementName, ResumeEducationComponent);
