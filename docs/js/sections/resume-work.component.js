import { formatDate } from '../date.helper.js';
import { groupByKeyword, sortSkills } from '../skills.helper.js';
import { injectSharedStyles } from '../styles.js';

const template = document.createElement('template');
template.innerHTML = `
<article>
<h1 class="text-decoration-underline">Experience</h1>
<ul class="list-group list-group-flush d-print-block" slot="work"/>
</article>`;

export const elementName = 'resume-work';
class ResumeWorkComponent extends HTMLElement {
  data = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    injectSharedStyles(this.shadowRoot);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.data = JSON.parse(this.attributes.data.value);
    this.#setupWork();
  }

  #setupWork() {
    if (!this.data?.work.length > 0) return;
    this.shadowRoot.querySelector("[slot='work']").innerHTML = this.data.work
      .map(work => {
        const {
          company,
          description,
          endDate,
          highlights,
          keywords,
          position,
          startDate,
          summary,
          website,
        } = work;
        return `<li class="card d-print-block list-group-item border-light">
<a href="${website}" target="_blank" class="d-flex align-content-center bg-success text-white justify-content-between card-header text-decoration-none">
    <h2 class="mb-0">${company}</h2>
    <span class="d-flex align-items-center">${formatDate(startDate)} - ${
          endDate ? formatDate(endDate) : 'Present'
        }</span>

</a>
<section class="card-body">
<h3 class="card-title ">${description}</h3>
<h4 class="card-subtitle mb-2 text-muted">${position}</h4>
${this.#skills(keywords)}
<p class="card-text">${summary}</p>
<ul>
${highlights?.map(highlight => `<li>${highlight}</li>`).join('') ?? ''}
</ul>
</li>
</section>
`;
      })
      .join('');
  }

  #skills(keywords) {
    return `<ul class="list-unstyled mb-2 d-flex gap-1 flex-wrap">${sortSkills(
      groupByKeyword(this.data.skills ?? [], keywords),
    )
      .map(([keyword, level]) => {
        const isClassified = level !== 'Unknown';
        if (!isClassified) return `<li class="badge bg-info">${keyword}</li>`;
        return `<li class="badge ${
          level === 'Master' ? 'bg-primary' : 'bg-secondary'
        }">${keyword}</li>`;
      })
      .join('')}</ul>`;
  }
}

customElements.define(elementName, ResumeWorkComponent);
